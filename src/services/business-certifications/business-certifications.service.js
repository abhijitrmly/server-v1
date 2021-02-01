// Initializes the `business-certifications` service on path `/business-certifications`
const { BusinessCertifications } = require('./business-certifications.class');
const createModel = require('../../models/business-certifications.model');
const hooks = require('./business-certifications.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/business-certifications', new BusinessCertifications(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('business-certifications');

  service.hooks(hooks);
};
