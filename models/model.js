const db = require('../config/database');

const User = {
  getAll: (callback) => {
    db.query('SELECT Id, nombre, email, images FROM users', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT Id, nombre, email, images FROM usuarios WHERE Id = ?', [id], callback);
  },

  getByEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
  },

  create: (userData, callback) => {
    const { nombre, email, password, images } = userData;
    db.query(
      'INSERT INTO users (nombre, email, password, images) VALUES (?, ?, ?, ?)',
      [nombre, email, password, images || ''],
      callback
    );
  },

  update: (id, userData, callback) => {
    const { nombre, email, images } = userData;
    db.query(
      'UPDATE users SET nombre = ?, email = ?, images = ? WHERE Id = ?',
      [nombre, email, images, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.query('DELETE FROM users WHERE Id = ?', [id], callback);
  }
};

module.exports = User;