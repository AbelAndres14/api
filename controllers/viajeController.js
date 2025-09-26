const Viaje = require('../models/viajeModel');

let io; // instancia de Socket.IO que se inyectará desde server.js

// Función para inyectar Socket.IO
const setSocketInstance = (socketInstance) => {
  io = socketInstance;
};

// Crear un nuevo viaje
const createViaje = async (req, res) => {
  try {
    const { ubicacion, objeto, destinatario, estacion, fechaCreacion } = req.body;

    console.log('📩 Datos del viaje recibidos:', req.body);

    // Validar datos requeridos
    if (!ubicacion || !objeto || !destinatario || !estacion) {
      return res.status(400).json({
        success: false,
        error: 'Ubicación, objeto, destinatario y estación son requeridos'
      });
    }

    const fechaMySQL = fechaCreacion
      ? new Date(fechaCreacion).toISOString().slice(0, 19).replace('T', ' ')
      : new Date().toISOString().slice(0, 19).replace('T', ' ');

    const viajeData = {
      ubicacion,
      objeto,
      destinatario,
      estacion,
      fecha_creacion: fechaMySQL,
      estado: 'pendiente'
    };

    Viaje.create(viajeData, (err, results) => {
      if (err) {
        console.error('❌ Error creando viaje en DB:', err.sqlMessage || err);
        return res.status(500).json({
          success: false,
          error: 'Error al crear el viaje en la base de datos'
        });
      }

      // 🔔 Notificación al destinatario
      if (io) {
        io.to(destinatario).emit("notificacion", {
          titulo: "Nuevo objeto en camino",
          mensaje: `Se ha creado un viaje para entregarte: ${objeto}`,
          viaje: { id: results.insertId, ...viajeData }
        });
      }

      res.status(201).json({
        success: true,
        message: '✅ Viaje creado exitosamente',
        viaje: { id: results.insertId, ...viajeData }
      });
    });

  } catch (error) {
    console.error('🔥 Error inesperado en createViaje:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Actualizar estado del viaje
const updateViajeEstado = (req, res) => {
  const id = req.params.id;
  const { estado } = req.body;

  if (!estado) {
    return res.status(400).json({
      success: false,
      error: 'Estado es requerido'
    });
  }

  Viaje.updateEstado(id, estado, (err, results) => {
    if (err) {
      console.error('❌ Error actualizando estado de viaje:', err);
      return res.status(500).json({
        success: false,
        error: 'Error al actualizar el viaje'
      });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Viaje no encontrado'
      });
    }

    // 🔔 Notificación al destinatario
    Viaje.getById(id, (err, rows) => {
      if (!err && rows.length > 0 && io) {
        const viaje = rows[0];
        io.to(viaje.destinatario).emit("notificacion", {
          titulo: "Actualización de tu viaje",
          mensaje: `El estado de tu objeto (${viaje.objeto}) cambió a: ${estado}`,
          viaje
        });
      }
    });

    res.json({ success: true, message: '✅ Estado del viaje actualizado' });
  });
};

// Exportar funciones y setter de Socket.IO
module.exports = {
  createViaje,
  getAllViajes: (req, res) => Viaje.getAll((err, results) => {
    if (err) return res.status(500).json({ success: false, error: 'Error al obtener los viajes' });
    res.json({ success: true, viajes: results });
  }),
  getViajeById: (req, res) => {
    const id = req.params.id;
    Viaje.getById(id, (err, results) => {
      if (err) return res.status(500).json({ success: false, error: 'Error al obtener el viaje' });
      if (!results || results.length === 0) return res.status(404).json({ success: false, message: 'Viaje no encontrado' });
      res.json({ success: true, viaje: results[0] });
    });
  },
  updateViajeEstado,
  deleteViaje: (req, res) => {
    const id = req.params.id;
    Viaje.delete(id, (err, results) => {
      if (err) return res.status(500).json({ success: false, error: 'Error al eliminar el viaje' });
      if (results.affectedRows === 0) return res.status(404).json({ success: false, message: 'Viaje no encontrado' });
      res.json({ success: true, message: '✅ Viaje eliminado' });
    });
  },
  setSocketInstance
};
