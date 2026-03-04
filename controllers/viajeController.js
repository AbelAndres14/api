const Viaje = require('../models/viajeModel');

let io;
let usuariosConectados;

const setSocketInstance = (socketInstance, usuarios) => {
  io = socketInstance;
  usuariosConectados = usuarios;
};

const createViaje = async (req, res) => {
  try {
    const { ubicacion, objeto, destinatarioId, estacion, fechaCreacion } = req.body;
    console.log('📩 Datos del viaje recibidos:', req.body);
    console.log('🔌 Usuarios conectados actualmente:', Object.keys(usuariosConectados));

    if (!ubicacion || !objeto || !destinatarioId || !estacion) {
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
      destinatario: String(destinatarioId),
      estacion,
      fecha_creacion: fechaMySQL,
      estado: 'pendiente'
    };

    Viaje.create(viajeData, async (err, results) => {
      if (err) {
        console.error('❌ Error creando viaje en DB:', err.sqlMessage || err);
        return res.status(500).json({
          success: false,
          error: 'Error al crear el viaje en la base de datos'
        });
      }

      console.log('✅ Viaje creado exitosamente:', results.insertId);

      if (io) {
        const idStr = String(destinatarioId);
        if (usuariosConectados[idStr]) {
          io.to(usuariosConectados[idStr]).emit("notificacion", {
            titulo: "Nuevo objeto en camino",
            mensaje: `Se ha creado un viaje para entregarte: ${objeto}`,
            viaje: { id: results.insertId, ...viajeData }
          });
          console.log(`🔔 Notificación enviada a usuario ID: ${idStr} (Conectado)`);
        } else {
          console.log(`⚠️ Usuario ${idStr} no está conectado actualmente`);
        }
      }

      res.status(201).json({
        success: true,
        message: '✅ Viaje creado exitosamente',
        viaje: { id: results.insertId, ...viajeData }
      });
    });

  } catch (error) {
    console.error('🔥 Error inesperado en createViaje:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

const updateViajeEstado = (req, res) => {
  const id = req.params.id;
  const { estado } = req.body;

  if (!estado) {
    return res.status(400).json({ success: false, error: 'Estado es requerido' });
  }

  Viaje.updateEstado(id, estado, (err, results) => {
    if (err) {
      console.error('❌ Error actualizando estado de viaje:', err);
      return res.status(500).json({ success: false, error: 'Error al actualizar el viaje' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Viaje no encontrado' });
    }

    if (io) {
      Viaje.getById(id, (err, rows) => {
        if (!err && rows.length > 0) {
          const viaje = rows[0];
          const destinatarioId = String(viaje.destinatario);
          if (usuariosConectados[destinatarioId]) {
            io.to(usuariosConectados[destinatarioId]).emit("notificacion", {
              titulo: "Actualización de tu viaje",
              mensaje: `El estado de tu objeto (${viaje.objeto}) cambió a: ${estado}`,
              viaje
            });
          }
        }
      });
    }

    res.json({ success: true, message: '✅ Estado del viaje actualizado' });
  });
};

const getUsuariosConectados = (req, res) => {
  const usuariosActivos = Object.keys(usuariosConectados);
  res.json({ success: true, usuariosConectados: usuariosActivos.length, usuarios: usuariosActivos });
};

const getAllViajes = (req, res) => {
  Viaje.getAll((err, results) => {
    if (err) {
      console.error('❌ Error obteniendo viajes:', err);
      return res.status(500).json({ success: false, error: 'Error al obtener los viajes' });
    }
    res.json({ success: true, viajes: results });
  });
};

const getViajeById = (req, res) => {
  const id = req.params.id;
  Viaje.getById(id, (err, results) => {
    if (err) {
      console.error('❌ Error obteniendo viaje por ID:', err);
      return res.status(500).json({ success: false, error: 'Error al obtener el viaje' });
    }
    if (!results || results.length === 0) {
      return res.status(404).json({ success: false, message: 'Viaje no encontrado' });
    }
    res.json({ success: true, viaje: results[0] });
  });
};

// ✅ NUEVO: viajes del usuario (donde es destinatario)
const getViajesByUsuario = (req, res) => {
  const userId = req.params.userId;
  Viaje.getByUsuario(userId, (err, results) => {
    if (err) {
      console.error('❌ Error obteniendo viajes del usuario:', err);
      return res.status(500).json({ success: false, error: 'Error al obtener los viajes' });
    }
    res.json({ success: true, viajes: results });
  });
};

const deleteViaje = (req, res) => {
  const id = req.params.id;
  Viaje.delete(id, (err, results) => {
    if (err) {
      console.error('❌ Error eliminando viaje:', err);
      return res.status(500).json({ success: false, error: 'Error al eliminar el viaje' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Viaje no encontrado' });
    }
    res.json({ success: true, message: '✅ Viaje eliminado' });
  });
};

module.exports = {
  createViaje,
  getAllViajes,
  getViajeById,
  getViajesByUsuario,
  updateViajeEstado,
  deleteViaje,
  setSocketInstance,
  getUsuariosConectados
};