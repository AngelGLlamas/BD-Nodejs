const express = require('express');
const morgan = require('morgan');

const logger = require('./config/logger');

const app = express();

//Setup middleware
app.use(
  morgan('combined', { stream: { write: (message) => logger.info(message) } })
);

app.get('/', (req, res, next) => {
  res.json({
    message: 'Bienvenido a la API',
  });
});

//ruta no encontrada
app.use((req, res, next) => {
  const message = 'Route not found';
  const statusCode = 404;

  logger.warn(message);

  res.status(statusCode);
  res.json({
    message,
  });
});

//Manejar errores
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  logger.error(message);

  res.status(statusCode);
  res.json({
    message,
  });
});

module.exports = app;
