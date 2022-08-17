const relateRulesConfig = {
  paramsName: 'relateRulesConfig',
  idPath: '_id',
  herePath: 'rules',
  therePath: 'inAbilities',
  thereService: 'rules',
};

const relateRolesConfig = {
  paramsName: 'relateRolesConfig',
  idPath: '_id',
  herePath: 'inRoles',
  therePath: 'abilityIds',
  thereService: 'roles',
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      context => {
        const {relate} = require('@iy4u/common-server-lib').hooks;
        
        relate('mtm', relateRulesConfig)(context);
        relate('mtm', relateRolesConfig)(context);
      },
    ],
    update: [
      context => {
        const {relate} = require('@iy4u/common-server-lib').hooks;
    
        relate('mtm', relateRulesConfig)(context);
        relate('mtm', relateRolesConfig)(context);
      },
    ],
    patch: [
      context => {
        const {relate} = require('@iy4u/common-server-lib').hooks;
    
        relate('mtm', relateRulesConfig)(context);
        relate('mtm', relateRolesConfig)(context);
      },
    ],
    remove: [
      context => {
        const {relate} = require('@iy4u/common-server-lib').hooks;
    
        relate('mtm', relateRulesConfig)(context);
        relate('mtm', relateRolesConfig)(context);
      },
    ],
  },
  
  after: {
    all: [
      context => {
        const {joinHooks: {fJoinHook}} = require('@iy4u/common-server-lib').hooks;
      
        fJoinHook('rules', 'rules')(context);
      }
    ],
    find: [],
    get: [],
    create: [
      context => {
        const {relate} = require('@iy4u/common-server-lib').hooks;
    
        relate('mtm', relateRulesConfig)(context);
        relate('mtm', relateRolesConfig)(context);
      },
    ],
    update: [
      context => {
        const {relate} = require('@iy4u/common-server-lib').hooks;
    
        relate('mtm', relateRulesConfig)(context);
        relate('mtm', relateRolesConfig)(context);
      },
    ],
    patch: [
      context => {
        const {relate} = require('@iy4u/common-server-lib').hooks;
    
        relate('mtm', relateRulesConfig)(context);
        relate('mtm', relateRolesConfig)(context);
      },
    ],
    remove: [
      context => {
        const {relate} = require('@iy4u/common-server-lib').hooks;
    
        relate('mtm', relateRulesConfig)(context);
        relate('mtm', relateRolesConfig)(context);
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
