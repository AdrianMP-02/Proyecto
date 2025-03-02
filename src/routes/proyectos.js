const express = require('express');
const router = express.Router();
const { requireLogin, requireProjectAdmin } = require('../middleware/auth');
const proyectosController = require('../controllers/proyectosController');

router.get('/', requireLogin, proyectosController.listarProyectos);
router.get('/nuevo', requireLogin, proyectosController.nuevoProyecto);
router.post('/', requireLogin, proyectosController.crearProyecto);
router.get('/editar/:id', requireLogin, requireProjectAdmin, proyectosController.editarProyecto);
router.post('/editar/:id', requireLogin, requireProjectAdmin, proyectosController.actualizarProyecto);
router.post('/eliminar/:id', requireLogin, requireProjectAdmin, proyectosController.eliminarProyecto);

module.exports = router;
