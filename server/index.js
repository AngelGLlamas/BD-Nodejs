const express = require('express');

const app = express();

app.get('/', (req, res, next) => {
  res.json({
    message: 'Bienvenido a la API',
  });
});

//ruta no encontrada
app.use((req, res, next) => {
  res.status(404);
  res.json({
    message: 'Error. Route not found',
  });
});

//Manejar errores
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode);
  res.json({
    message,
  });
});

module.exports = app;
