const winston = require('winston');


// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  const logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    ]
  });

  if (!options.SERVICE) {
    options.SERVICE = 'all';
  }

  return async context => {
    if (options.SERVICE === context.path || options.SERVICE === 'all') {
      const pathContext = 'service-logger (path: ' + context.path + ', type: ' + context.type + ', method: ' + context.method + ')';

      if (options.LEVEL && options.LEVEL !== 'info') {
        switch (context.type) {
          case 'before':
          case 'after':
            logger.info(pathContext + ' => context.params: ' + JSON.stringify(context.params));
            logger.info(pathContext + ' => context.arguments: ' + JSON.stringify(context.arguments));
            logger.info(pathContext + ' => context.data: ' + JSON.stringify(context.data));
            break;
          case 'error':
            logger.error(pathContext + ' => context.params: ' + JSON.stringify(context.params));
            logger.error(pathContext + ' => context.arguments: ' + JSON.stringify(context.arguments));
            logger.error(pathContext + ' => context.data: ' + JSON.stringify(context.data));
            logger.error(pathContext + ' => context.result: ' + JSON.stringify(context.result));
            logger.error('FATAL: ' + pathContext + ' => errorHook => context.error: ' + JSON.stringify(context.error));
            break;
          default:
          // code block
        }
      }
    }

  };
};
