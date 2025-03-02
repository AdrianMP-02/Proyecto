const connection = require('../config/database');

const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

const requireProjectAdmin = (req, res, next) => {
  const proyectoId = req.params.id;
  const userId = req.session.userId;

  const query = `
    SELECT rol 
    FROM usuario_proyecto 
    WHERE usuario_id = ? AND proyecto_id = ?
  `;

  connection.query(query, [userId, proyectoId], (error, results) => {
    if (error || results.length === 0 || results[0].rol !== 'admin') {
      return res.status(403).send('Acceso denegado');
    }
    next();
  });
};

module.exports = {
  requireLogin,
  requireProjectAdmin
};
