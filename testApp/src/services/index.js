const batch = require('./batch/batch.service.js');

const users = require('./users/users.service.js');
const authManagement = require('@ionrev/ir-auth-management-server');
const Roles = require('../../../lib');


// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(batch);

  app.configure(users);
  authManagement.services.configureServices(app, ['sms']);
  Roles.services.configureServices(app);
};
