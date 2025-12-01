const express = require('express');
const cookieParser = require('cookie-parser'); 
const app = express();
app.use(express.json());
app.use(cookieParser()); 
app.get('/', (req, res) => {
  res.send('Hola Mundo desde Express!');
});
app.use('/api/auth', require('./routes/authRoutes')); 
app.use('/api/categorias', require('./routes/categoriaRoutes'));
app.use('/api/subcategorias', require('./routes/subcategoriaRoutes'));
app.use('/api/rangos-edad', require('./routes/rangoEdadRoutes'));
app.use('/api/dificultades', require('./routes/dificultadRoutes'));

module.exports = app;