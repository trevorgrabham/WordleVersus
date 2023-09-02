const DEFAULT = {
  username: null,
  email: null,
};

class User {
  constructor({ username, email } = {}) {
    this.username = username || DEFAULT.username;
    this.email = email || DEFAULT.email;
  }
}

export default User;
