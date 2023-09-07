const DEFAULT = {
  id: null,
  username: null,
  email: null,
};

class User {
  constructor({ id, username, email } = {}) {
    this.id = id || DEFAULT.id;
    this.username = username || DEFAULT.username;
    this.email = email || DEFAULT.email;
  }
}

module.exports = User;
