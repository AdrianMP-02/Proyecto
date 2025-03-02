const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gestion_proyectos',
  port: 3306
});

connection.connect(error => {
  if (error) {
    console.error('Error conectando a la base de datos:', error);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL en XAMPP');
});

module.exports = connection;
