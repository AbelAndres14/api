const User = require('../models/model');
const bcrypt = require('bcryptjs');

// Crear usuario - ENDPOINT PRINCIPAL
const createUser = async (req, res) => {
  try {
    // 🔧 AGREGADO: Extraer también el campo rostro
    const { nombre, apellido, password, telefono, correo, rostro } = req.body;

    console.log('Datos recibidos:', {
      nombre,
      apellido,
      correo,
      telefono,
      tieneRostro: !!rostro,
      tamañoRostro: rostro ? `${Math.round(rostro.length / 1024)} KB` : 'Sin rostro'
    });

    // 🔧 AGREGADO: Validar también que rostro esté presente
    if (!nombre || !apellido || !password || !telefono || !correo || !rostro) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, apellido, password, teléfono, correo y rostro son requeridos'
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

     
        const userData = {
          nombre: nombre + ' ' + apellido, // Combinar nombre y apellido
          email: correo,
          password: hashedPassword, // Contraseña hasheada
          telefono: telefono,
          rostro: rostro 
        };

        console.log('Creando usuario con rostro de tamaño:', rostro.length, 'caracteres');

        User.create(userData, (err, results) => {
          if (err) {
            console.error('Error creando usuario:', err);
            return res.status(500).json({
              success: false,
              error: 'Error al crear el usuario'
            });
          }

          console.log('Usuario creado exitosamente con ID:', results.insertId);

          res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            user: {
              Id: results.insertId,
              nombre: nombre,
              apellido: apellido,
              telefono: telefono,
              correo: correo,
              tieneRostro: true // Confirmar que se guardó el rostro
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

// Función para buscar nombres de usuarios
const searchUserNames = (req, res) => {
  const search = req.query.q; 

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

    res.json({
  success: true,
  usuarios: results.map(u => ({
    id: u.id,      // el ID real del usuario
    nombre: u.nombre
  }))
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
      correo: req.body.correo,
      rostro: req.body.rostro 
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

// Exportar todas las funciones (UNA SOLA EXPORTACIÓN)
module.exports = {
  createUser,
  createUserPHP,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUserNames};