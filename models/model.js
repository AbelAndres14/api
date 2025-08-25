const db = require('../config/database');

const User = {
  getAll: (callback) => {
    db.query('SELECT id, nombre, email FROM usuarios', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT id, nombre, email FROM usuarios WHERE id = ?', [id], callback);
  },

  getByEmail: (email, callback) => {
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], callback);
  },

 // En models/model.js
create: (userData, callback) => {
  const { nombre, email, password, telefono } = userData;
  db.query(
    'INSERT INTO usuarios (nombre, email, password, telefono) VALUES (?, ?, ?, ?)',
    [nombre, email, password, telefono || ''],
    callback
  );
},

  update: (id, userData, callback) => {
    const { nombre, email } = userData;
    // ✅ QUITA la columna images si no existe
    db.query(
      'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?',
      [nombre, email, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.query('DELETE FROM usuarios WHERE id = ?', [id], callback);
  }
};

module.exports = User;