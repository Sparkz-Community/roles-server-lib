// Application hooks that run for every service
const { softDelete, paramsFromClient, iff } = require('feathers-hooks-common');

// const restQueryUnstringify = require('./hooks/rest-query-unstringify');

const { utils } = require('@iy4u/common-server-lib');
const ServiceLogger = utils.logger;
ServiceLogger.level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';


module.exports = {
  before: {
    all: [
      // restQueryUnstringify(),
      paramsFromClient('disableSoftDelete'),
      iff(
        context => !['authentication', 'appauth', 'secret/keys'].includes(context.path) && !context.params.softDeleteOff,
        softDelete({
          // eslint-disable-next-line no-unused-vars
          deletedQuery: async context => {
            return {deleted: { $ne: true }, deletedAt: null};
          },
          // eslint-disable-next-line no-unused-vars
          removeData: async context => {
            return {deleted: true, deletedAt: new Date()};
          }
        })
      ),
      // iff(logOn || process.env.DEBUG === 'true', ServiceLogger())
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      // iff(logOn || process.env.DEBUG === 'true', ServiceLogger())
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [
      // iff(logOn || process.env.DEBUG === 'true', ServiceLogger({LEVEL: 'error'}))
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
