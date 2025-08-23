const User = require('../models/model');

// Crear usuario - ENDPOINT PRINCIPAL
exports.createUser = async (req, res) => {
  try {
    const { nombre, correo, password, telefono } = req.body;

    console.log('Datos recibidos:', req.body);

    // Validaciones
    if (!nombre || !correo || !password) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, correo y password son requeridos'
      });
    }

    // Verificar si el correo ya existe
    User.getByEmail(correo, (err, results) => {
      if (err) {
        console.error('Error verificando email:', err);
        return res.status(500).json({
          success: false,
          error: 'Error interno del servidor'
        });
      }

      if (results.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'El correo electrónico ya está registrado'
        });
      }

      // Crear el usuario
      const userData = {
        name: nombre,
        email: correo,
        password: password,
        telefono: telefono || '' // Campo opcional
      };

      User.create(userData, (err, results) => {
        if (err) {
          console.error('Error creando usuario:', err);
          return res.status(500).json({
            success: false,
            error: 'Error al crear el usuario'
          });
        }

        res.status(201).json({
          success: true,
          message: 'Usuario registrado exitosamente',
          user: {
            id: results.insertId,
            nombre: nombre,
            correo: correo,
            telefono: telefono
          }
        });
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

// Endpoint compatible con tu código PHP actual
exports.createUserPHP = (req, res) => {
  // Adaptar para el formato ?accion=crear
  if (req.query.accion === 'crear') {
    // Mapear los datos del formato PHP al formato nuevo
    req.body = {
      nombre: req.body.nombre,
      correo: req.body.correo,
      password: req.body.password,
      telefono: req.body.telefono
    };
    exports.createUser(req, res);
  } else {
    res.status(400).json({
      success: false,
      error: 'Acción no válida'
    });
  }
};

// Obtener todos los usuarios
exports.getAllUsers = (req, res) => {
  User.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Obtener usuario por ID
exports.getUserById = (req, res) => {
  const id = req.params.id;
  User.getById(id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(results[0]);
  });
};

// Actualizar usuario
exports.updateUser = (req, res) => {
  const id = req.params.id;
  User.update(id, req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario actualizado' });
  });
};

// Eliminar usuario
exports.deleteUser = (req, res) => {
  const id = req.params.id;
  User.delete(id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado' });
  });
};