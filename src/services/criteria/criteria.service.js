// Initializes the `criteria` service on path `/criteria`
const { Criteria } = require('./criteria.class');
const createModel = require('../../models/criteria.model');
const hooks = require('./criteria.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/criteria', new Criteria(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('criteria');

  service.hooks(hooks);
};
