// Initializes the `users` service on path `/users`
const { Users } = require('./users.class');
const createModel = require('../../models/users.model');
const hooks = require('./users.hooks');

const {generateDefaultInstance} = require('@iy4u/common-server-lib').hooks;
const {lodash:{lget}} = require('@iy4u/common-server-lib').packages;

Array.prototype.insert = function (index, ...value) {
  this.splice(index, 0, ...value);
  return this;
};


module.exports = function (app) {

  const projectInstanceName = lget(generateDefaultInstance(app),'name');
  const mongoConfigName= `${projectInstanceName}MongooseClient`;
  const connection = app.get(mongoConfigName);

  const options = {
    Model: createModel(app, {connection}),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/users', new Users(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('users');

  service.hooks(hooks);
};
