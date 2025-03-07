const connection = require('../config/database');

const proyectosController = {
  listarProyectos: (req, res) => {
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
  },

  nuevoProyecto: (req, res) => {
    connection.query('SELECT id, nombre FROM usuarios', (error, usuarios) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.render('proyectos/nuevo', { usuarios: usuarios });
    });
  },

  editarProyecto: (req, res) => {
    const proyectoId = req.params.id;
    connection.query('SELECT * FROM proyectos WHERE id = ?', [proyectoId], (error, proyecto) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.render('proyectos/editar', { proyecto: proyecto[0] });
    });
  },

  actualizarProyecto: (req, res) => {
    const proyectoId = req.params.id;
    const proyecto = {
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      fecha_inicio: req.body.fecha_inicio,
      fecha_fin: req.body.fecha_fin,
      estado: req.body.estado
    };

    connection.query('UPDATE proyectos SET ? WHERE id = ?', [proyecto, proyectoId], (error) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.redirect('/proyectos');
    });
  },

  eliminarProyecto: (req, res) => {
    const proyectoId = req.params.id;
    connection.query('DELETE FROM proyectos WHERE id = ?', [proyectoId], (error) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.redirect('/proyectos');
    });
  }
};

module.exports = proyectosController;
