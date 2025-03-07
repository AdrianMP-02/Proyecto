const pool = require('../config/database');

const obtenerProyectos = async (usuarioId) => {
    const query = `
        SELECT p.* FROM proyectos p
        INNER JOIN usuario_proyecto up ON p.id = up.proyecto_id
        WHERE up.usuario_id = ?
    `;
    const [proyectos] = await pool.query(query, [usuarioId]);
    return proyectos;
};

const obtenerEstadisticas = async (usuarioId) => {
    const query = `
        SELECT 
            (SELECT COUNT(*) FROM tareas t 
             INNER JOIN usuario_tarea ut ON t.id = ut.tarea_id 
             WHERE ut.usuario_id = ? AND t.estado = 'pendiente') as tareas_pendientes,
            (SELECT COUNT(*) FROM tareas t 
             INNER JOIN usuario_tarea ut ON t.id = ut.tarea_id 
             WHERE ut.usuario_id = ? 
             AND t.fecha_vencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)) as proximos_vencimientos
    `;
    const [resultados] = await pool.query(query, [usuarioId, usuarioId]);
    return resultados[0];
};

const getDashboard = async (req, res) => {
    try {
        const usuarioId = req.session.userId;
        const proyectos = await obtenerProyectos(usuarioId);
        const estadisticas = await obtenerEstadisticas(usuarioId);
        
        res.render('dashboard/index', {
            usuario: req.session.usuario,
            proyectos: proyectos,
            estadisticas: estadisticas
        });
    } catch (error) {
        console.error('Error en el dashboard:', error);
        res.status(500).send('Error al cargar el dashboard');
    }
};

module.exports = {
    getDashboard
};
