CREATE TABLE game (
  id SERIAL PRIMARY KEY,
  "creationDatetime" TIMESTAMP NOT NULL,
  "p1id" INT,
  FOREIGN KEY ("p1id") REFERENCES "player" (id),
  "p2id" INT,
  FOREIGN KEY ("p2id") REFERENCES "player" (id),
  winner INT,
  FOREIGN KEY (winner) REFERENCES "player" (id),
  CONSTRAINT check_winner CHECK (winner = "p1id" OR winner = "p2id")
);