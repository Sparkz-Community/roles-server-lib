const {AuthenticationService, JWTStrategy, AuthenticationBaseStrategy} = require('@feathersjs/authentication');
const {LocalStrategy} = require('@feathersjs/authentication-local');
const {expressOauth} = require('@feathersjs/authentication-oauth');
const session = require('express-session');
const winston = require('winston');

const redisConnect = require('./redis');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console()
  ]
});

// eslint-disable-next-line no-unused-vars
class AnonymousStrategy extends AuthenticationBaseStrategy {
  // eslint-disable-next-line no-unused-vars
  async authenticate(authentication, params) {
    return {
      anonymous: true
    };
  }
}

// eslint-disable-next-line no-unused-vars
const {NotAuthenticated} = require('@feathersjs/errors');
// const axios = require('axios');

const lget = require('lodash.get');
const lomit = require('lodash.omit');
const lpick = require('lodash.pick');


module.exports = app => {

  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());

  app.use('/authentication', authentication);

  app.configure(redisConnect);


  app.configure(expressOauth({
    expressSession: session({
      store: redisConnect.sessionStore,
      secret: app.get('authentication').secret,
      resave: false,
      saveUninitialized: false
    })
  }));

  const beforeHook = context => {
    if (process.env.DEBUG) {
      logger.info('authentication.js => beforeHook => context.params:' + JSON.stringify(context.params));
      logger.info('authentication.js => beforeHook => context.arguments:' + JSON.stringify(context.arguments));
      logger.info('authentication.js => beforeHook => context.data:' + JSON.stringify(context.data));
    }
  };

  const afterHook = context => {
    if (process.env.DEBUG) {
      logger.info('authentication.js => afterHook => context.params:' + JSON.stringify(context.params));
      logger.info('authentication.js => afterHook => context.arguments:' + JSON.stringify(context.arguments));
      logger.info('authentication.js => afterHook => context.data:' + JSON.stringify(context.data));
    }
  };


  const errorHook = context => {
    logger.error('FATAL: authentication.js => errorHook => context.error:' + JSON.stringify(context.error));
  };


  app.service('authentication').hooks({
    before: {
      create: [
        beforeHook
      ]
    },
    after: {
      create: [
        afterHook,
        context => {
          const {user} = context.result;
          if (!user.isVerified) {
            throw new NotAuthenticated('User Account is not yet verified.');
          }

          const authenticationConfig = context.app.get('authentication');
          const defaultWhitelist = ['_id', 'createdAt', 'updatedAt'];
          let _user;
          let enforceWhitelist = lget(authenticationConfig, 'enforceWhitelist', true);
          let whitelistUserFields = lget(authenticationConfig, 'whitelistUserFields', []);
          if (enforceWhitelist || whitelistUserFields.length) _user = lpick(user, whitelistUserFields.concat(defaultWhitelist));

          let blacklistUserFields = lget(authenticationConfig, 'blacklistUserFields', []);
          _user = lomit(_user, blacklistUserFields);

          context.dispatch = Object.assign({}, context.result, {user: _user});
          return context;
        },
      ]
    },
    error: {
      create: [
        errorHook
      ]
    }
  });
};


