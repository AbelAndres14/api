const User = require('../models/model');
const bcrypt = require('bcryptjs');

// Crear usuario - ENDPOINT PRINCIPAL
const createUser = async (req, res) => {
  try {
    const { nombre, apellido, password, telefono, correo } = req.body;

    console.log('Datos recibidos:', req.body);

    if (!nombre || !apellido || !password || !telefono || !correo) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, apellido, password, teléfono y correo son requeridos'
      });
    }

    // Verificar si el correo ya existe
    User.getByEmail(correo, async (err, results) => {
      if (err) {
        console.error('Error verificando correo:', err);
        return res.status(500).json({
          success: false,
          error: 'Error interno del servidor'
        });
      }

      if (results.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'El correo ya está registrado'
        });
      }

      // Hash de la contraseña
      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario con la estructura correcta
        const userData = {
          nombre: nombre + ' ' + apellido, // Combinar nombre y apellido
          email: correo,
          password: hashedPassword, // Contraseña hasheada
          telefono: telefono
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
              apellido: apellido,
              telefono: telefono,
              correo: correo
            }
          });
        });

      } catch (hashError) {
        console.error('Error hasheando password:', hashError);
        return res.status(500).json({
          success: false,
          error: 'Error interno del servidor'
        });
      }
    });

  } catch (error) {
    console.error('Error inesperado:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Buscar usuarios por nombre o correo (para autocompletado)
// Buscar solo nombres de usuarios para autocompletado
const searchUserNames = (req, res) => {
  const search = req.query.q; // ejemplo: /api/users/suggest?q=and

  if (!search || search.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Parámetro de búsqueda requerido (q)'
    });
  }

  User.searchNames(search, (err, results) => {
    if (err) {
      console.error('Error en búsqueda de nombres:', err);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }

    // Devuelvo solo un array de nombres
    res.json({
      success: true,
      nombres: results.map(u => u.nombre)
    });
  });
};

// Función para login
const loginUser = async (req, res) => {
  try {
    const { correo, password } = req.body;

    console.log('Datos de login recibidos:', { correo });

    if (!correo || !password) {
      return res.status(400).json({
        success: false,
        error: 'Correo y password son requeridos'
      });
    }

    // Buscar usuario por correo
    User.getByEmail(correo, async (err, results) => {
      if (err) {
        console.error('Error buscando usuario:', err);
        return res.status(500).json({
          success: false,
          error: 'Error interno del servidor'
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          success: false,
          error: 'Credenciales inválidas'
        });
      }

      const user = results[0];

      // Verificar contraseña
      try {
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res.status(401).json({
            success: false,
            error: 'Credenciales inválidas'
          });
        }

        res.json({
          success: true,
          message: 'Login exitoso',
          user: {
            id: user.id,
            nombre: user.nombre,
            telefono: user.telefono,
            correo: user.email
          }
        });

      } catch (compareError) {
        console.error('Error comparando passwords:', compareError);
        return res.status(500).json({
          success: false,
          error: 'Error interno del servidor'
        });
      }
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
      apellido: req.body.apellido,
      password: req.body.password,
      telefono: req.body.telefono,
      correo: req.body.correo
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
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};