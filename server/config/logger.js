const { createLogger, format, transports } = require('winston');

//setup logger
const logger = createLogger({
  format: format.simple(),
  transports: [new transports.Console()],
});

module.exports = logger;
