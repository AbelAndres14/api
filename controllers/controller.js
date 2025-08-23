exports.createUser = async (req, res) => {
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
        images: images || '' // Campo para la imagen
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