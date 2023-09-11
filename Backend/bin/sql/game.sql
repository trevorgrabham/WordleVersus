CREATE TABLE game (
  id SERIAL PRIMARY KEY,
  "creationDatetime" TIMESTAMP NOT NULL,
  "p1id" INT,
  FOREIGN KEY ("p1id") REFERENCES "player" ("playerId"),
  "p2id" INT,
  FOREIGN KEY ("p2id") REFERENCES "player" ("playerId"),
  winner INT,
  FOREIGN KEY (winner) REFERENCES "player" ("playerId"),
  CONSTRAINT check_winner CHECK (winner = "p1id" OR winner = "p2id")
);