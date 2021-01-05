// Initializes the `material` service on path `/material`
const { Material } = require('./material.class');
const createModel = require('../../models/material.model');
const hooks = require('./material.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/material', new Material(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('material');

  service.hooks(hooks);
};
