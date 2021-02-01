// Initializes the `compliance-business` service on path `/compliance-business`
const { ComplianceBusiness } = require('./compliance-business.class');
const createModel = require('../../models/compliance-business.model');
const hooks = require('./compliance-business.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/compliance-business', new ComplianceBusiness(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('compliance-business');

  service.hooks(hooks);
};
