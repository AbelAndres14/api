const express = require('express');
const router = express.Router();
const userController = require('../controllers/controller');
const viajeController = require('../controllers/viajeController');
const rostroController = require('../controllers/rostro');
const { searchUserNames } = require('../controllers/controller');

router.post('/usuario', userController.createUser);
router.post('/usuario.php', userController.createUserPHP);
router.get('/usuarios', userController.getAllUsers);
router.get('/usuario/:id', userController.getUserById);
router.put('/usuario/:id', userController.updateUser);
router.delete('/usuario/:id', userController.deleteUser);
router.post('/usuario/login', userController.loginUser);

router.post('/viajes', viajeController.createViaje);
router.get('/viajes', viajeController.getAllViajes);
router.get('/viajes/usuario/:userId', viajeController.getViajesByUsuario); // ✅ ANTES de /viajes/:id
router.get('/viajes/:id', viajeController.getViajeById);
router.put('/viajes/:id/estado', viajeController.updateViajeEstado);
router.delete('/viajes/:id', viajeController.deleteViaje);
router.get('/users/suggest', searchUserNames);
router.get('/usuarios-conectados', viajeController.getUsuariosConectados);

module.exports = router;