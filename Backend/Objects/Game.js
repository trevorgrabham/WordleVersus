const DEFAULT = {
  dateTime: () => {
    new Date().toISOString();
  },
  p1: null,
  p2: null,
  winner: null,
};

class Game {
  constructor({ dateTime, p1, p2, winner }) {
    this.dateTime = dateTime || DEFAULT.dateTime;
    this.p1 = p1 || DEFAULT.p1;
    this.p2 = p2 || DEFAULT.p2;
    this.winner = winner || DEFAULT.winner;
  }
}

export default Game;
