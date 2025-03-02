const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const connection = require('./config/database');
const app = express();

// Configuración básica
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de sesión
app.use(session({
  secret: 'secreto-seguro-aqui',
  resave: false,
  saveUninitialized: true
}));

// Middleware para datos de usuario globales
app.use((req, res, next) => {
    if (req.session.userId) {
        connection.query('SELECT id, nombre, email FROM usuarios WHERE id = ?', [req.session.userId], (error, usuarios) => {
            if (usuarios && usuarios[0]) {
                res.locals.usuario = usuarios[0];
            }
            next();
        });
    } else {
        next();
    }
});

// Middleware de autenticación
const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
};

// Rutas
const indexRoutes = require('./routes/index');
const usuariosRoutes = require('./routes/usuarios');
const proyectosRoutes = require('./routes/proyectos');
const dashboardRoutes = require('./routes/dashboard');

app.use('/', indexRoutes);
app.use('/', usuariosRoutes);
app.use('/proyectos', requireLogin, proyectosRoutes);
app.use('/dashboard', requireLogin, dashboardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;
