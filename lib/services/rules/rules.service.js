// Initializes the `rules` service on path `/rules`
const {packages: {lodash: {lget, lmergeWith}}, extensionUtils: {hookCustomizer}} = require('@iy4u/common-utils');

const { Rules } = require('./rules.class');
const createModel = require('../../models/rules.model');
const hooks = require('./rules.hooks');

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
    const ExtendedClass = extend_class_fn(Rules);
    // Initialize our service with any options it requires
    app.use('/rules', new ExtendedClass(options, app));
  } else {
    // Initialize our service with any options it requires
    app.use('/rules', new Rules(options, app));
  }

  // Get our initialized service so that we can register hooks
  const service = app.service('rules');

  service.hooks(lmergeWith(hooks, extend_hooks, hookCustomizer));
};
