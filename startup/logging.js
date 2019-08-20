const winston   = require('winston')
const {log}     = require('../middleware/logger')

module.exports  = function() {

    process.on("uncaughtException",  ex => {
        log (ex.stack);
        // process.exit(1);
    });
      
    process.on("unhandledRejection", ex => {
        log (ex.stack);
        throw ex; // after throw winston get it.
        winston.error(ex.message, ex);
        process.exit(1);
    });

    winston.handleExceptions(
        new winston.transports.Console  ({ colorize: true , prettyPrint:  true }),
        // new winston.transports.File     ({ filename: '../logs/ExceptionHandler.log' }),
    );

    winston.add(winston.transports.File, { filename: 'logs/error.log' });
}
