const User = require('../models/model');

// Crear usuario - ENDPOINT PRINCIPAL
const createUser = async (req, res) => {
  try {
    const { nombre, email, password, images } = req.body;

    console.log('Datos recibidos:', req.body);

    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, email y password son requeridos'
      });
    }

    // Verificar si el email ya existe
    User.getByEmail(email, (err, results) => {
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
          error: 'El email ya está registrado'
        });
      }

      // Crear el usuario con la estructura correcta
      const userData = {
        nombre: nombre,
        email: email,
        password: password,
        images: images || ''
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
            Id: results.insertId,
            nombre: nombre,
            email: email,
            images: images
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
const createUserPHP = (req, res) => {
  if (req.query.accion === 'crear') {
    req.body = {
      nombre: req.body.nombre,
      email: req.body.email,
      password: req.body.password,
      images: req.body.images
    };
    createUser(req, res);
  } else {
    res.status(400).json({
      success: false,
      error: 'Acción no válida'
    });
  }
};

// Obtener todos los usuarios
const getAllUsers = (req, res) => {
  User.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Obtener usuario por ID
const getUserById = (req, res) => {
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
const updateUser = (req, res) => {
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
const deleteUser = (req, res) => {
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

// Exportar todas las funciones
module.exports = {
  createUser,
  createUserPHP,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};