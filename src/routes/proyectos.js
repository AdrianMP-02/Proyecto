const express = require('express');
const router = express.Router();
const connection = require('../config/database');
const { requireLogin, requireProjectAdmin } = require('../middleware/auth');
const proyectosController = require('../controllers/proyectosController');

// Rutas con controladores
router.get('/', requireLogin, proyectosController.listarProyectos);
router.get('/nuevo', requireLogin, proyectosController.nuevoProyecto);

// Crear nuevo proyecto
router.post('/', requireLogin, (req, res) => {
  const proyecto = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    fecha_inicio: req.body.fecha_inicio,
    fecha_fin: req.body.fecha_fin,
    estado: 'pendiente',
    creador_id: req.session.userId
  };

  connection.beginTransaction(err => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    connection.query('INSERT INTO proyectos SET ?', proyecto, (error, result) => {
      if (error) {
        return connection.rollback(() => {
          res.status(500).json({ error: error.message });
        });
      }

      const usuarioProyecto = {
        usuario_id: req.session.userId,
        proyecto_id: result.insertId,
        rol: 'admin'
      };

      connection.query('INSERT INTO usuario_proyecto SET ?', usuarioProyecto, (error) => {
        if (error) {
          return connection.rollback(() => {
            res.status(500).json({ error: error.message });
          });
        }

        connection.commit(err => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).json({ error: err.message });
            });
          }
          res.redirect('/proyectos');
        });
      });
    });
  });
});

router.get('/editar/:id', requireLogin, requireProjectAdmin, proyectosController.editarProyecto);
router.post('/editar/:id', requireLogin, requireProjectAdmin, proyectosController.actualizarProyecto);
router.post('/eliminar/:id', requireLogin, requireProjectAdmin, proyectosController.eliminarProyecto);

module.exports = router;
