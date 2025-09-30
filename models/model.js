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

  create: (userData, callback) => {
    // 🔧 AGREGADO: Extraer también el campo rostro
    const { nombre, email, password, telefono, rostro } = userData;
    
    // 🔧 MODIFICADO: Query para incluir el campo rostro
    db.query(
      'INSERT INTO usuarios (nombre, email, password, telefono, rostro) VALUES (?, ?, ?, ?, ?)',
      [nombre, email, password, telefono || '', rostro || null],
      callback
    );
  },

  update: (id, userData, callback) => {
    const { nombre, email } = userData;
    db.query(
      'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?',
      [nombre, email, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.query('DELETE FROM usuarios WHERE id = ?', [id], callback);
  },

  searchNames: (search, callback) => {
    const query = `
      SELECT id, nombre 
      FROM usuarios 
      WHERE nombre LIKE ? 
      LIMIT 10
    `;
    const likeSearch = `%${search}%`;
    db.query(query, [likeSearch], callback);
  }
};

module.exports = User;