const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const connection = require('../config/database');

router.get('/login', (req, res) => {
    res.render('auth/login', { layout: false });
});

router.get('/registro', (req, res) => {
    res.render('auth/registro', { layout: false });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    connection.query('SELECT * FROM usuarios WHERE email = ?', [email], (error, results) => {
        if (results.length > 0 && bcrypt.compareSync(password, results[0].password)) {
            req.session.userId = results[0].id;
            res.redirect('/dashboard');
        } else {
            res.redirect('/login');
        }
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;
