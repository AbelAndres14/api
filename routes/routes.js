const express = require('express');
const router = express.Router();
const userController = require('../controllers/controller');
const viajeController = require('../controllers/viajeController'); // plural
const { searchUserNames } = require('../controllers/controller');


// Ruta para crear usuario (que coincide con tu app React Native)
router.post('/usuario', userController.createUser);

// Ruta específica para el parámetro ?accion=crear
router.post('/usuario.php', userController.createUserPHP);

// Otras rutas para tu API
router.get('/usuarios', userController.getAllUsers);
router.get('/usuario/:id', userController.getUserById);
router.put('/usuario/:id', userController.updateUser);
router.delete('/usuario/:id', userController.deleteUser);
router.post('/usuario/login', userController.loginUser);

router.post('/viajes', viajeController.createViaje);
router.get('/viajes', viajeController.getAllViajes);
router.get('/viajes/:id', viajeController.getViajeById);
router.put('/viajes/:id/estado', viajeController.updateViajeEstado);
router.delete('/viajes/:id', viajeController.deleteViaje);      // DELETE /api/viajes/:id
router.get('/users/suggest', searchUserNames);

module.exports = router;