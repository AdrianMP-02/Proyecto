const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const connection = require('../config/database');

router.get('/', (req, res) => {
  // Primera consulta para obtener proyectos
  connection.query(`
    SELECT p.*, up.rol 
    FROM proyectos p
    INNER JOIN usuario_proyecto up ON p.id = up.proyecto_id
    WHERE up.usuario_id = ?
    ORDER BY p.created_at DESC
  `, [req.session.userId], (error, proyectos) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Segunda consulta para obtener estadísticas
    connection.query(`
      SELECT 
        (SELECT COUNT(*) FROM tareas t 
         INNER JOIN usuario_tarea ut ON t.id = ut.tarea_id 
         WHERE ut.usuario_id = ? AND t.estado = 'pendiente') as tareas_pendientes,
        (SELECT COUNT(*) FROM tareas t 
         INNER JOIN usuario_tarea ut ON t.id = ut.tarea_id 
         WHERE ut.usuario_id = ? 
         AND t.fecha_vencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)) as proximos_vencimientos
    `, [req.session.userId, req.session.userId], (error, estadisticas) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.render('dashboard/index', {
        proyectos: proyectos,
        estadisticas: estadisticas[0]
      });
    });
  });
});

module.exports = router;
