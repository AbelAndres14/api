// controllers/viajeController.js
const Viaje = require('../models/viajeModel');

// Crear un nuevo viaje
const createViaje = async (req, res) => {
  try {
    const { ubicacion, objeto, destinatario, estacion, fechaCreacion, estado } = req.body;

    console.log('Datos del viaje recibidos:', req.body);

    // Validar datos requeridos
    if (!ubicacion || !objeto || !destinatario || !estacion) {
      return res.status(400).json({
        success: false,
        error: 'Ubicación, objeto, destinatario y estación son requeridos'
      });
    }

    // Preparar datos del viaje
    const viajeData = {
      ubicacion,
      objeto,
      destinatario,
      estacion,
      fechaCreacion: fechaCreacion || new Date().toISOString(),
      estado: estado || 'pendiente'
    };

    // Crear el viaje en la base de datos
    Viaje.create(viajeData, (err, results) => {
      if (err) {
        console.error('Error creando viaje:', err);
        return res.status(500).json({
          success: false,
          error: 'Error al crear el viaje'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Viaje creado exitosamente',
        viaje: {
          id: results.insertId,
          ...viajeData
        }
      });
    });

  } catch (error) {
    console.error('Error inesperado:', error);
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
      console.error('Error obteniendo viajes:', err);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener los viajes'
      });
    }
    res.json({
      success: true,
      viajes: results
    });
  });
};

// Obtener viaje por ID
const getViajeById = (req, res) => {
  const id = req.params.id;
  Viaje.getById(id, (err, results) => {
    if (err) {
      console.error('Error obteniendo viaje:', err);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener el viaje'
      });
    }
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Viaje no encontrado'
      });
    }
    res.json({
      success: true,
      viaje: results[0]
    });
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
      console.error('Error actualizando viaje:', err);
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
    res.json({
      success: true,
      message: 'Estado del viaje actualizado'
    });
  });
};

// Eliminar viaje
const deleteViaje = (req, res) => {
  const id = req.params.id;
  Viaje.delete(id, (err, results) => {
    if (err) {
      console.error('Error eliminando viaje:', err);
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
    res.json({
      success: true,
      message: 'Viaje eliminado'
    });
  });
};

module.exports = {
  createViaje,
  getAllViajes,
  getViajeById,
  updateViajeEstado,
  deleteViaje
};