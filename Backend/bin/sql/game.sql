CREATE TABLE game (
  id SERIAL PRIMARY KEY,
  creation_datetime TIMESTAMP NOT NULL,
  p1_id INT,
  FOREIGN KEY (p1_id) REFERENCES "player" (id),
  p2_id INT,
  FOREIGN KEY (p2_id) REFERENCES "player" (id),
  winner INT,
  FOREIGN KEY (winner) REFERENCES "player" (id),
  CONSTRAINT check_winner CHECK (winner = p1_id OR winner = p2_id)
);