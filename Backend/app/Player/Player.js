const DEFAULT = {
  playerId: null,
  username: null,
  email: null,
  password: null,
};

class Player {
  constructor({ playerId, username, email, password } = {}) {
    this.playerId = playerId || DEFAULT.playerId;
    this.username = username || DEFAULT.username;
    this.email = email || DEFAULT.email;
    this.password = password || DEFAULT.password;
  }

  toString() {
    return `Player(${this.playerId}: ${this.username}, ${this.email})`;
  }
}

module.exports = Player;
