var socket = io();

// Use pos to keep track of which square is next to be filled
// Starts at 20, because we use letter class in help page as well
let pos = 0;
let minPos = pos;     // Tracks how far back the user can delete
let maxPos = pos + 5; // Tracks how far the user can type
let gameWon = false;   // Allows the player to play until they've won
// Starting colors
let color1 = "black";
let color2 = "white";
// Stores keyboard in list so we can index it and get the letters
const keyboard = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D",
	"F", "G", "H", "J", "K", "L", "Submit", "Z", "X", "C", "V", "B",
	"N", "M", "Del"]

// Most important function call => listens for clicks and key presses
eventListen();

socket.emit('start game');

let correctString = ''

socket.on('start game', function (randomWord) {
	correctString = randomWord;
});

let opponentPos = 30;
socket.on('opponent guess', function (colors) {
	console.log(colors);
	for (let i = opponentPos; i < opponentPos + 5; i++) {
		let square = document.getElementsByClassName("letter")[i];
		square.style.backgroundColor = colors[i - opponentPos];
		square.style.borderColor = color2;
	}
});

function eventListen() {
	
	// Need to use onkeydown instead of keypress to handle backspaces and deletes
	document.onkeydown = function (e) {
		if (e.keyCode == 82 && e.ctrlKey) { // Doesn't print R in a box on Ctrl+R
			//pass
		} else {
			keyPressed(e.keyCode);
		}
	};
	// Loops through keyboard buttons
	for (let i = 0; i < keyboard.length; i++) {
		// Listen for click
		document.getElementsByClassName("key")[i].addEventListener("click", function () {
			keyClicked(i);
		});
	}
}

function keyClicked(i) {
	if (i !== 19 && i !== 27) {   // 19 is submit and 27 is delete
		addToBoard(keyboard[i]);
	} else if (i === 27 && pos > 0) {
		deleteFromBoard();
	} else if (i === 19 && (pos % 5 == 0) && (pos > minPos)) {  
		enterGuess(createString(pos));
	}
}

function keyPressed(key) {
	// Handles key events based on what key was pressed
	if ((97 <= key && key <= 122) || (65 <= key && key <= 90)) { //a to z or A to Z

		let letter = String.fromCharCode(key).toUpperCase();
		let keyIndex = keyboard.findIndex((x) => x === letter);
		addToBoard(letter);
		keyPressedStyle(keyIndex);

	} else if (key === 13) { //Enter
		keyPressedStyle(19);
		if ((pos % 5 == 0) && (pos > minPos) && !gameWon) {
			enterGuess(createString(pos));
		}

	} else if (key === 8 || key === 46) { //Delete or Backspace
		keyPressedStyle(27);
		deleteFromBoard();
	}
}

function addToBoard(letter) {
	if (pos < maxPos && !gameWon) {
		let square = document.getElementsByClassName("letter")[pos];
		square.textContent = letter;
		square.style.color = color1;
		pos++;
	}
}

function deleteFromBoard() {
	if (pos > minPos) {
		pos--;
	}
	let square = document.getElementsByClassName("letter")[pos];
	square.textContent = "";
	square.style.color = color2;
}

function createString(pos) {
	let userGuess = "";
	for (let i = pos - 5; i < pos; i++) {
		userGuess += document.getElementsByClassName("letter")[i].textContent;
	}
	return userGuess;
}

function keyPressedStyle(keyIndex) {
	let key = document.getElementsByClassName("key")[keyIndex]
	// Manually create a key pressed animation using setTimeout
	key.style.fontWeight = "bold";
	key.style.borderWidth = "2px"
	setTimeout(function () {
		key.style.fontWeight = "normal";
		key.style.borderWidth = "1px";
	}, 50);
}

function enterGuess(userGuess) {
	let included = false;
	socket.emit('check guess', userGuess);
	socket.on('check guess', msg => {
		included = msg;
		parseGuess(included)
	});
}

function parseGuess(included) {
	if (included && pos > minPos) {
		let numCorrectLetters = 0;
		let colors = ["gray", "gray", "gray", "gray", "gray"];
		for (let i = pos - 5; i < pos; i++) {
			let square = document.getElementsByClassName("letter")[i];
			let key = document.getElementsByClassName("key")[keyboard.indexOf(square.textContent)];
			if (correctString.charAt(i % 5) == square.textContent) {   // correct postion
				colors[i % 5] = "green";
 				square.style.backgroundColor = "green";   // Change colors to green
				square.style.color = color2;
				square.style.borderColor = color2;
				numCorrectLetters++;
				key.style.backgroundColor = "green";
				key.style.color = color2;
				key.style.borderColor = color2;
			} else if (correctString.indexOf(square.textContent) >= 0) {   // in word, incorrect position
				colors[i % 5] = "gold";
				square.style.backgroundColor = "gold";   // Change colors to gold
				square.style.color = color2;
				square.style.borderColor = color2;
				if (key.style.backgroundColor !== "green") { // Sets color priority
					key.style.backgroundColor = "gold";
				}
				key.style.color = color2;
				key.style.borderColor = color2;
			} else {
				square.style.backgroundColor = "gray";   // Change colors to gray
				square.style.color = color2;
				square.style.borderColor = color2;
				key.style.backgroundColor = "gray";
				key.style.color = color2;
				key.style.borderColor = color2;
			}
		}

		socket.emit('opponent guess', colors);
		
		if (numCorrectLetters == 5) {     // If all 5 letters are green, player wins
			//winStyle((pos) / 5);       
			gameWon = true;
		} else if (pos === 30) {
			//loseStyle();
			gameWon = true;
		}

		// Updates the typing boundaries
		minPos += 5;
		maxPos += 5;
	} else {
		console.log("invalid word")
		//invalidWordStyle(pos);
	}
}

function invalidWordStyle(pos) {

	// Function not complete without pug changes

	// Display the message box when a player inputs an invalid word
	let squares = document.getElementsByClassName("letter");
	for(let i = pos - 5; i < pos; i++) {
		squares[i].style.borderWidth = "2px"
	}
	setTimeout(function() {
		for(let i = pos - 5; i < pos; i++) {
			squares[i].style.borderWidth = "1px"
		}
	},100);
}