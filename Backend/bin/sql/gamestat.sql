CREATE TABLE gamestat (
  "gameId" INT,
  FOREIGN KEY ("gameId") REFERENCES "game" (id),
  "playerId" INT,
  FOREIGN KEY ("playerId") REFERENCES "player" ("playerId"),
  "numCorrectWordsGuessed" INT,
  "numGuessesTotal" INT,
  PRIMARY KEY ("gameId", "playerId")
);