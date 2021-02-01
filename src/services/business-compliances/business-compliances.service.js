// Initializes the `business-compliances` service on path `/business-compliances`
const { BusinessCompliances } = require('./business-compliances.class');
const createModel = require('../../models/business-compliances.model');
const hooks = require('./business-compliances.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/business-compliances', new BusinessCompliances(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('business-compliances');

  service.hooks(hooks);
};
