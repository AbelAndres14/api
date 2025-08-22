const User = require('../models/model');

// Controlador para la ruta POST /api/usuario
exports.createUser = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos son requeridos: nombre, correo, password'
      });
    }

    // Verificar si el correo ya existe
    User.getByEmail(correo, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Error al verificar el correo'
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
        password: password // En producción, deberías hashear la contraseña
      };

      User.create(userData, (err, results) => {
        if (err) {
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
            correo: correo
          }
        });
      });
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Controlador específico para /usuario.php?accion=crear
exports.createUserPHP = (req, res) => {
  // Para compatibilidad con la URL antigua
  if (req.query.accion === 'crear') {
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