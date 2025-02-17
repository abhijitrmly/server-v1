// Initializes the `certifications` service on path `/certifications`
const { Certifications } = require('./certifications.class');
const createModel = require('../../models/certifications.model');
const hooks = require('./certifications.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/certifications', new Certifications(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('certifications');

  service.hooks(hooks);
};
