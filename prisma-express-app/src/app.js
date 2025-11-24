const express = require('express');
const app = express();

// Middlewares
app.use(express.json());

// Ruta Hola Mundo
app.get('/', (req, res) => {
  res.send('Hola Mundo desde Express!');
});

// Rutas de la API
app.use('/api/categorias', require('./routes/categoriaRoutes'));
app.use('/api/subcategorias', require('./routes/subcategoriaRoutes'));
app.use('/api/rangos-edad', require('./routes/rangoEdadRoutes'));
app.use('/api/dificultades', require('./routes/dificultadRoutes'));

module.exports = app;