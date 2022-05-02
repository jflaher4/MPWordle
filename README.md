## Multiplayer Wordle

Final Project for Programming Paradigms Spring 2022

### Starting the game
1. To start the server, run "npm start" from student 04 on the command line. 
2. Then, open a new browser window and go to URL: "http://student04.cse.nd.edu:51001/"
3. This will get you to the game lobby where a random username is generated for each player and a chat function exists.
4. From another device, enter the same URL.

### Playing the game
- Once two players are in the lobby and both have pressed the "ready" button, there will be an option on both players' screens to enter the game. 
- Pressing enter will take the player to the game screen - an empty wordle grid with a keyboard below, a chat box, and an empty opponent board. 
- Once both players have entered the game, players may begin guessing what the word is (both players have the same goal word they are trying to guess). 
- Once a player guesses a valid word, their guess will change colors according to the correctness of their guess 

- Green = right letter, right location
- Yellow = right letter, wrong location
- Gray = letter not in word

- The player will be able to see the color of their opponent's guesses, but not the letters of the guess.
- The first player to correctly guess the word wins the game and there will be a game won message in the chat. 
- If a player uses all their guesses without guessing the correct word, their opponent has their remaining guesses to correctly guess the word. 
