const roles = require('./roles/roles.service.js');
const abilities = require('./abilities/abilities.service.js');
const rules = require('./rules/rules.service.js');
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
    removeService = lunion(removeService, lget(app.get('roles-server-lib'), 'removeService', []));

    for (const service of Object.keys(services)) {
      if (!removeService.includes(`${service}`)) app.configure(services[service]);
    }
  }
};
