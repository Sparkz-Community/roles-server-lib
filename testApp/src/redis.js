const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const tunnel = require('tunnel-ssh');
const { utils } = require('@iy4u/common-server-lib');
const logger = utils.logger;
logger.level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

if (process.env.DEBUG) {
  redis.debug_mode = true;
}

module.exports = function (app) {
  const redisConf = app.get('redis');


  const TUNNEL = JSON.parse(String(process.env.TUNNEL_REDIS || false).toLowerCase());

  logger.info('TUNNEL_REDIS - ' + TUNNEL);

  if (TUNNEL) {
    const sshTunnelConfig = {
      agent: redisConf.agent,
      username: redisConf.sshTunnelConfig.username,
      privateKey: require('fs').readFileSync(redisConf.sshTunnelConfig.privateKey),
      passphrase: redisConf.sshTunnelConfig.passphrase,
      host: redisConf.sshTunnelConfig.host,
      port: redisConf.sshTunnelConfig.port,
      dstHost: redisConf.sshTunnelConfig.dstHost,
      dstPort: redisConf.sshTunnelConfig.dstPort,
      localHost: redisConf.sshTunnelConfig.localHost,
      localPort: redisConf.sshTunnelConfig.localPort
    };

    redisConf.host = sshTunnelConfig.localHost;
    redisConf.port = sshTunnelConfig.localPort;

    // eslint-disable-next-line no-unused-vars
    tunnel(sshTunnelConfig, (error, server) => {
      if (error) {
        logger.error('SSH tunnel connection for Redis via SSH host - ' + sshTunnelConfig.host + error);
        process.exit(1);
      } else {
        logger.info('SSH tunnel ready for Redis via SSH host - ' + sshTunnelConfig.host);
      }
    });
  }


  const redisClient = redis.createClient({
    host: redisConf.host,
    port: redisConf.port,
    password: redisConf.password,
    db: redisConf.db
  });

  // redisClient.unref();
  redisClient.on('ready', function() {
    logger.info('Redis connection to ' + redisConf.host + ' is ready!');
  });

  redisClient.on('error', function (err) {
    logger.error('FATAL: Redis server connection error - ' + err);
  });
  setInterval(function () {
    try {
      redisClient.set('Ping', 'Pong');

    } catch (error) {
      logger.error('Redis heartbeat failed! error - ' + error);
    }
  }, 5000);
  exports.sessionStore = new RedisStore({client: redisClient});
  exports.sessionStore.client.on('error', function (err) {
    logger.error('FATAL: Redis server sessionStore connection error - ' + err);
  });

}.bind(redis);
