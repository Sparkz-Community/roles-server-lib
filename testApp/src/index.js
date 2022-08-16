/* eslint-disable no-console */
const { utils } = require('@iy4u/common-server-lib');
const logger = utils.logger;
logger.level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

const app = require('./app');
const port = app.get('port');
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
);
