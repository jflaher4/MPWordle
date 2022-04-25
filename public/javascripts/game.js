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
	for (let i = 0; i < 2 * keyboard.length; i++) {
		// Listen for click
		document.getElementsByClassName("key")[i].addEventListener("click", function () {
			keyClicked(i);
		});
	}

}

function keyClicked(i) {
	if (i !== 47 && i !== 55) {   // 47 is submit and 55 is delete
		addToBoard(keyboard[i - 28]);
	} else if (i === 55 && pos > 0) {
		deleteFromBoard();
	} else if (i === 47 && (pos % 5 == 0) && (pos > minPos)) {  // ">20" makes sure pos is not at initial square
		enterGuess(createString(pos));
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

function enterGuess(userGuess) {
	return;
}