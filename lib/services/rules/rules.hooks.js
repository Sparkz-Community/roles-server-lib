const relateAbilitiesConfig = {
  paramsName: 'relateAbilitiesConfig',
  idPath: '_id',
  herePath: 'inAbilities',
  therePath: 'rules',
  thereService: 'abilities',
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      context => {
        const {relate} = require('@iy4u/common-server-lib').hooks;

        relate('mtm', relateAbilitiesConfig)(context);
      },
    ],
    update: [
      context => {
        const {relate} = require('@iy4u/common-server-lib').hooks;

        relate('mtm', relateAbilitiesConfig)(context);
      },
    ],
    patch: [
      context => {
        const {relate} = require('@iy4u/common-server-lib').hooks;

        relate('mtm', relateAbilitiesConfig)(context);
      },
    ],
    remove: [
      context => {
        const {relate} = require('@iy4u/common-server-lib').hooks;

        relate('mtm', relateAbilitiesConfig)(context);
      },
    ],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      context => {
        const {relate} = require('@iy4u/common-server-lib').hooks;

        relate('mtm', relateAbilitiesConfig)(context);
      },
    ],
    update: [
      context => {
        const {relate} = require('@iy4u/common-server-lib').hooks;

        relate('mtm', relateAbilitiesConfig)(context);
      },
    ],
    patch: [
      context => {
        const {relate} = require('@iy4u/common-server-lib').hooks;

        relate('mtm', relateAbilitiesConfig)(context);
      },
    ],
    remove: [
      context => {
        const {relate} = require('@iy4u/common-server-lib').hooks;

        relate('mtm', relateAbilitiesConfig)(context);
      },
    ],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
