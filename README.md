# Slime Volleyball

This is a project to explore both making games and using other computers as controllers via web sockets. The idea is to make a slime volleyball clone.

Why slime volleyball?
Because the game has simple rules and focuses on the movements of two characters to be controlled by two players. It is an opportunity to test multi touch capabilities combined with communicating via web sockets.


## Gameplan
- [X] Create the scene (just a wall in the middle)
- [X] Make characters (just two)
- [X] Introduce movement using keys (between one side of the canvas and the wall)
- [X] Create ball
- [X] Introduce jumping
- [X] Add basic physics to it
- [X] Add basic end game logic
- [X] Add ability to have rounds (best of 3)
- [X] Add communication logic w/ server and websockets
- [.] Game Polish:
  - [ ] Add menu
  - [ ] Add background music
  - [ ] Add sound effects
  - [X] Add indicators as to who's player one and who's player two (maybe with colors?)
  - [ ] Add types
  - [X] Add "New Game?" option
- [X] Server polish:
  - [X] Add rooms and hashes to isolate players


## Adding rooms
There's the concept of "rooms" in socket.io which sounds exactly like what I need.
I need to create a hash or something to represent a room.
Then the controller page needs to first have an entry screen with a text box to enter the hash of the room to join.
