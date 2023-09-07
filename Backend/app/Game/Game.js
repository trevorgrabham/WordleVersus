const DEFAULT = {
  id: null,
  creationDatetime: () => {
    return new Date();
  },
  p1id: null,
  p2id: null,
  winner: null,
};

class Game {
  constructor({ id, creationDatetime, p1id, p2id, winner }) {
    this.id = id || DEFAULT.id;
    this.creationDatetime = creationDatetime || DEFAULT.creationDatetime();
    this.creationDatetime = this.creationDatetime.toISOString();
    this.p1id = p1id || DEFAULT.p1id;
    this.p2id = p2id || DEFAULT.p2id;
    this.winner = winner || DEFAULT.winner;
  }
}

module.exports = Game;
