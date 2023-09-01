# To Do

### Set up the Database

(<u>Primary Key</u>, _unique_)

- Users (<u>Id</u>, _Username_, _Email_, **AnyOtherUserSettings...**)
- Games (<u>GameId</u>, TimeAndDate, P1Id, P2Id, WinnerId)
- GameStats(<u>GameId</u>, <u>PlayerId</u>, NumberOfWordles, NumberOfGuesses)
- GameRoom(<u>Id</u>, NumberOfPlayers)

From these tables we should be able to come up with player stats.

- We could get the number of games played by a user from joining Users to Gamestats on PlayerId == Id.
- We could get the number of Wordles (correct words guessed) in a similar way.
- We could get a users lifetime record against another player by joining Users and Games for Id == P1Id and Id == P2Id || Id == P2Id and Id == P1Id. We can even let users search by username and can use 'LIKE' along with the '%' and '\_' special characters to query our Database to find usernames that start with what the user is currently typing into the search bar to give them autocomplete suggestions.
- We could find the most and least number of Worldes in a single game also by joining Users and GameStats.
- Any other info that we want to track could also be added into the GameStats table and can then be joined to Users using the Id field.

### Figure out how to get two players into the same game

- Use a randomly generated string of numbers to create a _roomId_ number.
- Have players ready up once they get into the room.
-
