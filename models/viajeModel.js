// models/viajeModel.js
const db = require('../config/database'); // Ajusta la ruta según tu estructura

const Viaje = {
  // Crear un nuevo viaje
  create: (viajeData, callback) => {
    const query = `
      INSERT INTO viajes (ubicacion, objeto, destinatario, estacion, fecha_creacion, estado) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      viajeData.ubicacion,
      viajeData.objeto,
      viajeData.destinatario,
      viajeData.estacion,
      viajeData.fechaCreacion,
      viajeData.estado
    ];

    db.query(query, values, callback);
  },

  // Obtener todos los viajes
  getAll: (callback) => {
    const query = `
      SELECT id, ubicacion, objeto, destinatario, estacion, fecha_creacion, estado, 
             DATE_FORMAT(fecha_creacion, '%Y-%m-%d %H:%i:%s') as fecha_formateada
      FROM viajes 
      ORDER BY fecha_creacion DESC
    `;
    db.query(query, callback);
  },

  // Obtener viaje por ID
  getById: (id, callback) => {
    const query = `
      SELECT id, ubicacion, objeto, destinatario, estacion, fecha_creacion, estado,
             DATE_FORMAT(fecha_creacion, '%Y-%m-%d %H:%i:%s') as fecha_formateada
      FROM viajes 
      WHERE id = ?
    `;
    db.query(query, [id], callback);
  },

  // Obtener viajes por estado
  getByEstado: (estado, callback) => {
    const query = `
      SELECT id, ubicacion, objeto, destinatario, estacion, fecha_creacion, estado,
             DATE_FORMAT(fecha_creacion, '%Y-%m-%d %H:%i:%s') as fecha_formateada
      FROM viajes 
      WHERE estado = ?
      ORDER BY fecha_creacion DESC
    `;
    db.query(query, [estado], callback);
  },

  // Actualizar estado del viaje
  updateEstado: (id, estado, callback) => {
    const query = `
      UPDATE viajes 
      SET estado = ?, fecha_actualizacion = NOW() 
      WHERE id = ?
    `;
    db.query(query, [estado, id], callback);
  },

  // Eliminar viaje
  delete: (id, callback) => {
    const query = 'DELETE FROM viajes WHERE id = ?';
    db.query(query, [id], callback);
  }
};

module.exports = Viaje;