// const path = require('path');
const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const findOne = require('feathers-findone');

// const logger = require('./logger');

const services = require('./services');
const cliHooks = require('./cli.hooks');

const mongoose = require('./mongoose');

const commands = require('./commands');

const app = feathers();

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing

// Set up Plugins and providers
app.configure(findOne());
app.configure(mongoose);

// Set up our services (see `services/index.js`)
app.configure(services);

app.hooks(cliHooks);

// app.configure(commands);

app.initPrograms = (program) => {
  app.commands = {};
  Object.keys(commands).forEach((command) => {
    app.commands[command] = commands[command](app, program);
  });
};

app.setup();

app.setup();

module.exports = app;
