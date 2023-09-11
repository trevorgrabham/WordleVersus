const DEFAULT = {
  id: null,
  username: null,
  email: null,
};

class Player {
  constructor({ id, username, email } = {}) {
    this.id = id || DEFAULT.id;
    this.username = username || DEFAULT.username;
    this.email = email || DEFAULT.email;
  }

  toString() {
    return `Player(${this.username}, ${this.email})`;
  }
}

module.exports = Player;
