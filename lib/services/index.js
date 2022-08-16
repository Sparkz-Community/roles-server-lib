const roles = require('./ir-roles-roles/ir-roles-roles.service.js');
const abilities = require('./ir-roles-abilities/ir-roles-abilities.service.js');
const rules = require('./ir-roles-rules/ir-roles-rules.service.js');
const {packages: {lodash: {lget, lunion}}} = require('@iy4u/common-utils');

const services = {
  roles,
  abilities,
  rules
};

// eslint-disable-next-line no-unused-vars
module.exports = {
  ...services,
  configureServices: function (app, removeService = []) {
    removeService = lunion(removeService, lget(app.get('ir-roles-server'), 'removeService', []));

    for (const service of Object.keys(services)) {
      if (!removeService.includes(`${service}`)) app.configure(services[service]);
    }
  }
};
