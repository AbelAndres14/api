const mysql = require('mysql2');
equire('dotenv').config();
const connection = mysql.createConnection({
  host: process.env.DB_HOST || '192.168.33.30',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'bia',
  database: process.env.DB_NAME || 'tracky',
  port: process.env.DB_PORT || 3336, // Puerto por defecto de MySQL
  connectTimeout: 60000, // Aumenta el timeout a 60 segundos
  reconnect: true // Permitir reconexión
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL:', err.message);
    console.log('Verifica que:');
    console.log('1. MySQL esté instalado y corriendo');
    console.log('2. El usuario y password sean correctos');
    console.log('3. La base de datos exista');
    console.log('4. El host sea correcto');
    return;
  }
  console.log('✅ Conectado a MySQL correctamente');
});

// Manejar errores de conexión
connection.on('error', (err) => {
  console.error('Error de conexión MySQL:', err.message);
});

module.exports = connection;