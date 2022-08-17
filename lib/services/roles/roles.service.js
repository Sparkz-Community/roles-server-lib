// Initializes the `roles` service on path `/roles`
const {packages: {lodash: {lget, lmergeWith}}, extensionUtils: {hookCustomizer}} = require('@iy4u/common-utils');

const { Roles } = require('./roles.class');
const createModel = require('../../models/roles.model');
const hooks = require('./roles.hooks');

module.exports = function (app, {
  extend_hooks = {},
  extend_schema = {},
  schema_remove_paths = [],
  extend_class_fn = (superClass) => superClass,
} = {}) {
  const defaultName = lget(app.get('instances'), 'name', 'default');
  const connection = app.get(`${defaultName}MongooseClient`);
  
  const options = {
    Model: createModel(app, {connection, extend_schema, schema_remove_paths}),
    paginate: app.get('paginate'),
    multi: ['patch']
  };

  if (typeof extend_class_fn === 'function') {
    const ExtendedClass = extend_class_fn(Roles);
    // Initialize our service with any options it requires
    app.use('/roles', new ExtendedClass(options, app));
  } else {
    // Initialize our service with any options it requires
    app.use('/roles', new Roles(options, app));
  }

  // Get our initialized service so that we can register hooks
  const service = app.service('roles');

  service.hooks(lmergeWith(hooks, extend_hooks, hookCustomizer));
};
