const db = require('../config/database');

const Viaje = {
  create: (viajeData, callback) => {
    const query = `
      INSERT INTO viajes (ubicacion, objeto, destinatario, remitente, estacion, fecha_creacion, estado) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      viajeData.ubicacion,
      viajeData.objeto,
      viajeData.destinatario,
      viajeData.remitente,
      viajeData.estacion,
      viajeData.fecha_creacion,
      viajeData.estado
    ];
    db.query(query, values, callback);
  },

  getAll: (callback) => {
    const query = `
      SELECT id, ubicacion, objeto, destinatario, remitente, estacion, fecha_creacion, estado, 
             DATE_FORMAT(fecha_creacion, '%Y-%m-%d %H:%i:%s') as fecha_formateada
      FROM viajes 
      ORDER BY fecha_creacion DESC
    `;
    db.query(query, callback);
  },

  getById: (id, callback) => {
    const query = `
      SELECT id, ubicacion, objeto, destinatario, remitente, estacion, fecha_creacion, estado,
             DATE_FORMAT(fecha_creacion, '%Y-%m-%d %H:%i:%s') as fecha_formateada
      FROM viajes 
      WHERE id = ?
    `;
    db.query(query, [id], callback);
  },

  // Viajes donde el usuario es destinatario O remitente
  getByUsuario: (userId, callback) => {
    const query = `
      SELECT id, ubicacion, objeto, destinatario, remitente, estacion, fecha_creacion, estado,
             DATE_FORMAT(fecha_creacion, '%Y-%m-%d %H:%i:%s') as fecha_formateada
      FROM viajes 
      WHERE destinatario = ? OR remitente = ?
      ORDER BY fecha_creacion DESC
    `;
    db.query(query, [String(userId), String(userId)], callback);
  },

  getByEstado: (estado, callback) => {
    const query = `
      SELECT id, ubicacion, objeto, destinatario, remitente, estacion, fecha_creacion, estado,
             DATE_FORMAT(fecha_creacion, '%Y-%m-%d %H:%i:%s') as fecha_formateada
      FROM viajes 
      WHERE estado = ?
      ORDER BY fecha_creacion DESC
    `;
    db.query(query, [estado], callback);
  },

  updateEstado: (id, estado, callback) => {
    const query = `
      UPDATE viajes 
      SET estado = ?, fecha_actualizacion = NOW() 
      WHERE id = ?
    `;
    db.query(query, [estado, id], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM viajes WHERE id = ?';
    db.query(query, [id], callback);
  }
};

module.exports = Viaje;