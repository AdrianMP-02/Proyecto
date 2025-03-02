const express = require('express');
const router = express.Router();
const connection = require('../config/database');

router.get('/', (req, res) => {
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
    res.render('dashboard/index', {
      proyectos: proyectos
    });
  });
});

module.exports = router;
