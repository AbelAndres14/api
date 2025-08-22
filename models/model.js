const db = require('../config/database');

const User = {
  getAll: (callback) => {
    db.query('SELECT * FROM users', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], callback);
  },

  getByEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
  },

  create: (userData, callback) => {
    const { name, email, password } = userData;
    db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password],
      callback
    );
  },

  update: (id, userData, callback) => {
    const { name, email } = userData;
    db.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.query('DELETE FROM users WHERE id = ?', [id], callback);
  }
};

module.exports = User;