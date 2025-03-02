const express = require('express');
const router = express.Router();
const connection = require('../config/database');

// Ruta existente para listar proyectos
router.get('/', (req, res) => {
    const query = `
        SELECT p.*, up.rol 
        FROM proyectos p
        INNER JOIN usuario_proyecto up ON p.id = up.proyecto_id
        WHERE up.usuario_id = ?
        ORDER BY p.created_at DESC
    `;

    connection.query(query, [req.session.userId], (error, proyectos) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.render('proyectos/index', { proyectos: proyectos });
    });
});

// Nueva ruta para mostrar el formulario de nuevo proyecto
router.get('/nuevo', (req, res) => {
    connection.query('SELECT id, nombre FROM usuarios', (error, usuarios) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.render('proyectos/nuevo', { usuarios: usuarios });
    });
});

router.post('/', (req, res) => {
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

module.exports = router;
