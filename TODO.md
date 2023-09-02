# To Do

### Set up the Database

(<u>Primary Key</u>, _unique_)

- Users (<u>Id</u>, _Username_, _Email_, **AnyOtherUserSettings...**)
- Games (<u>GameId</u>, TimeAndDate, P1Id, P2Id, WinnerId)
- GameStats(<u>GameId</u>, <u>PlayerId</u>, NumberOfWordles, NumberOfGuesses)
- ActiveGameRooms(<u>RoomId</u>, Ready)

From these tables we should be able to come up with player stats.

- We could get the number of games played by a user from joining Users to Gamestats on PlayerId == Id.
- We could get the number of Wordles (correct words guessed) in a similar way.
- We could get a users lifetime record against another player by joining Users and Games for Id == P1Id and Id == P2Id || Id == P2Id and Id == P1Id. We can even let users search by username and can use 'LIKE' along with the '%' and '\_' special characters to query our Database to find usernames that start with what the user is currently typing into the search bar to give them autocomplete suggestions.
- We could find the most and least number of Worldes in a single game also by joining Users and GameStats.
- Any other info that we want to track could also be added into the GameStats table and can then be joined to Users using the Id field.

### Figure out how to get two players into the same game

- Use a randomly generated string of numbers to create a _roomId_ number.
- Keep track of the number of people currently on the GameRoom webpage. If somebody is trying to access the page and there are already two users on the page, the person requesting the page should not be allowed access to it until
- Have players ready up once they get into the room. When a GameRoom is created, the `Ready` value will be false. When a player ready's up, if `Ready` is already false then it is set to true. If it was true, then that means that the other player in the room is ready and the game can now start.
  - Because we could have a player enter the room alone, ready up, and then leave **AFTER** a second players enteres, but **BEFORE** the second player ready's up, we need to make sure that we reset any players that are ready **EVERY TIME** a user leaves the webpage. We can have the `Ready` button active whenever `Ready` is false, and we can set `Ready` to false and notify any users still on the page, whenever a user leaves the page.

### Game Logic

- Once the game starts, the players should be given player numbers based upon the order in which they ready uped. The game should keep track of two different games, swapping between the games depending on which player is currently playing.
- The game should start off with player 1, allowing them to make their first guess. Player two is shown the same screen, but they are unable to interact while it is not their turn.
- Once the current player makes their guess, the guess is shown and validated.
  - If the guess was correct, we need to swap the other players wordle (word to guess), ensuring that the new word **IS NOT** any of the players current guesses (guesses for the previous wordle), the previous wordle itself, or any previous wordles for either player. We can keep track of previous wordles in a `blacklist` variable and create a copy that also contains the previous guesses as well and continue to grab a new word until it is not on the `blacklist`
  - If the guess was incorrect and the player has no guesses remaining, the game ends and the other player is the winner.
  - If the guess was incorrect, but the player still has guesses remaining, the turn ends and it is the other players turn and we can repeat these steps until the game ends.
