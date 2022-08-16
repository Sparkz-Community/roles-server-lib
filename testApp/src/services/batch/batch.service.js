// Initializes the `sms` service on path `/batch`
const hooks = require('./batch.hooks');

const { BatchService } = require('feathers-batch');

module.exports = function (app) {
  // const options = {
  // };

  // Initialize our service with any options it require
  app.use('/batch', new BatchService(app));

  // Get our initialized service so that we can register hooks
  const service = app.service('batch');

  service.hooks(hooks);
};
