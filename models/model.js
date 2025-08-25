const db = require('../config/database');

const User = {
  getAll: (callback) => {
    db.query('SELECT id, nombre, email, images, hObs_emotion FROM usuarios', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT id, nombre, email, images, hObs_emotion FROM usuarios WHERE id = ?', [id], callback);
  },

  getByEmail: (email, callback) => {
    // ✅ CAMBIA "users" POR "usuarios"
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], callback);
  },

  create: (userData, callback) => {
    const { nombre, email, password, images } = userData;
    // ✅ CAMBIA "users" POR "usuarios"
    db.query(
      'INSERT INTO usuarios (nombre, email, password, images) VALUES (?, ?, ?, ?)',
      [nombre, email, password, images || ''],
      callback
    );
  },

  update: (id, userData, callback) => {
    const { nombre, email, images } = userData;
    // ✅ CAMBIA "users" POR "usuarios"
    db.query(
      'UPDATE usuarios SET nombre = ?, email = ?, images = ? WHERE id = ?',
      [nombre, email, images, id],
      callback
    );
  },

  delete: (id, callback) => {
    // ✅ CAMBIA "users" POR "usuarios"
    db.query('DELETE FROM usuarios WHERE id = ?', [id], callback);
  }
};

module.exports = User;