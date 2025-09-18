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

    // Preparar datos del viaje
    const viajeData = {
      ubicacion,
      objeto,
      destinatario,
      estacion,
      fecha_creacion: fechaCreacion || new Date().toISOString(), // Si no viene, usa fecha actual
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

// Resto de funciones se mantienen igual
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
