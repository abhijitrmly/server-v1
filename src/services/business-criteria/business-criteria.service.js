// Initializes the `business-criteria` service on path `/business-criteria`
const { BusinessCriteria } = require('./business-criteria.class');
const createModel = require('../../models/business-criteria.model');
const hooks = require('./business-criteria.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/business-criteria', new BusinessCriteria(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('business-criteria');

  service.hooks(hooks);
};
