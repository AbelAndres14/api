const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/routes');
const { errorHandler } = require('./middleware/hadler');

const app = express();
const PORT = process.env.PORT || 3337;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api', userRoutes); // Todas las rutas empiezan con /api

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API funcionando!',
    endpoints: {
      crearUsuario: 'POST /api/usuario',
      crearUsuarioPHP: 'POST /api/usuario.php?accion=crear',
      obtenerUsuarios: 'GET /api/usuarios'
    }
  });
});

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en localhost:${PORT}`);
});