const express = require('express');
const router = express.Router();
const userController = require('../controllers/controller');

// Ruta para crear usuario (que coincide con tu app React Native)
router.post('/usuario', userController.createUser);

// Ruta específica para el parámetro ?accion=crear
router.post('/usuario.php', userController.createUserPHP);

// Otras rutas para tu API
router.get('/usuarios', userController.getAllUsers);
router.get('/usuario/:id', userController.getUserById);
router.put('/usuario/:id', userController.updateUser);
router.delete('/usuario/:id', userController.deleteUser);

module.exports = router;