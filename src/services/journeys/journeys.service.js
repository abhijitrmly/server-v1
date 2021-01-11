// Initializes the `journeys` service on path `/journeys`
const { Journeys } = require('./journeys.class');
const hooks = require('./journeys.hooks');

module.exports = function JourneyService(Model) {
  return function (app) {
    const options = {
      Model,
      paginate: app.get('paginate'),
    };

    // Initialize our service with any options it requires
    app.use('/journeys', new Journeys(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('journeys');

    service.hooks(hooks);
  };
};
