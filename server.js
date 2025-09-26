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

const usuariosConectados = {}; // userId -> socketId

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('registrarUsuario', (userId) => {
    usuariosConectados[userId] = socket.id;
    console.log(`✅ Usuario ${userId} registrado en sala ${socket.id}`);
  });

  socket.on('disconnect', () => {
    // Opcional: limpiar usuariosConectados
    for (const [uid, sid] of Object.entries(usuariosConectados)) {
      if (sid === socket.id) delete usuariosConectados[uid];
    }
  });
});

// -----------------------------------------------------

const viajeController = require('./controllers/viajeController');
viajeController.setSocketInstance(io, usuariosConectados);

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en localhost:${PORT}`);
});
