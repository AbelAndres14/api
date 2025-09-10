const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || '192.168.33.30',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'bia',
  database: process.env.DB_NAME || 'tracky',
  port: process.env.DB_PORT || 3336,
  connectTimeout: 60000,
  // Eliminada la opción 'reconnect' que no existe en mysql2
  // En su lugar, mysql2 maneja las reconexiones automáticamente
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
  // Intentar reconectar si se pierde la conexión
  if(err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Intentando reconectar...');
  }
});

module.exports = connection;