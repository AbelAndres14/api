const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/routes');
const { errorHandler } = require('./middleware/hadler');
const { setSocketInstance } = require('./controllers/viajeController'); // <-- importamos setter

const app = express();
const PORT = process.env.PORT || 3008;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api', userRoutes);

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

// -------------------- SOCKET.IO --------------------
const http = require('http');
const { Server } = require('socket.io');

// Creamos servidor HTTP a partir de la app Express
const server = http.createServer(app);

// Instancia Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // puedes poner tu dominio si lo tienes
    methods: ['GET', 'POST']
  }
});

// Inyectamos Socket.IO en el controller
setSocketInstance(io);

// Manejo de usuarios conectados
io.on('connection', (socket) => {
  console.log('🔗 Usuario conectado:', socket.id);

  // Cada usuario se registra con su ID
  socket.on('registrarUsuario', (userId) => {
    socket.join(userId); // sala por userId
    console.log(`✅ Usuario ${userId} registrado en sala ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Usuario desconectado:', socket.id);
  });
});
// -----------------------------------------------------

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en localhost:${PORT}`);
});
