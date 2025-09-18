// controllers/viajeController.js
const Viaje = require('../models/viajeModel');

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

    // Convertir fecha al formato MySQL DATETIME
    const fechaMySQL = fechaCreacion
      ? new Date(fechaCreacion).toISOString().slice(0, 19).replace('T', ' ')
      : new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Preparar datos del viaje
    const viajeData = {
      ubicacion,
      objeto,
      destinatario,
      estacion,
      fecha_creacion: fechaMySQL,
      estado: 'pendiente'
    };

    // Guardar en la base de datos
    Viaje.create(viajeData, (err, results) => {
      if (err) {
        console.error('❌ Error creando viaje en DB:', err.sqlMessage || err);
        return res.status(500).json({
          success: false,
          error: 'Error al crear el viaje en la base de datos'
        });
      }

      res.status(201).json({
        success: true,
        message: '✅ Viaje creado exitosamente',
        viaje: {
          id: results.insertId,
          ...viajeData
        }
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

// Obtener todos los viajes
const getAllViajes = (req, res) => {
  Viaje.getAll((err, results) => {
    if (err) {
      console.error('❌ Error obteniendo viajes:', err);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener los viajes'
      });
    }
    res.json({ success: true, viajes: results });
  });
};

// Obtener viaje por ID
const getViajeById = (req, res) => {
  const id = req.params.id;

  Viaje.getById(id, (err, results) => {
    if (err) {
      console.error('❌ Error obteniendo viaje por ID:', err);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener el viaje'
      });
    }
    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Viaje no encontrado'
      });
    }
    res.json({ success: true, viaje: results[0] });
  });
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
    res.json({ success: true, message: '✅ Estado del viaje actualizado' });
  });
};

// Eliminar viaje
const deleteViaje = (req, res) => {
  const id = req.params.id;

  Viaje.delete(id, (err, results) => {
    if (err) {
      console.error('❌ Error eliminando viaje:', err);
      return res.status(500).json({
        success: false,
        error: 'Error al eliminar el viaje'
      });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Viaje no encontrado'
      });
    }
    res.json({ success: true, message: '✅ Viaje eliminado' });
  });
};

module.exports = {
  createViaje,
  getAllViajes,
  getViajeById,
  updateViajeEstado,
  deleteViaje
};
