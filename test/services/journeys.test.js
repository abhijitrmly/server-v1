const assert = require('assert');
const app = require('../../src/app');

describe('\'journeys\' service', () => {
  it('registered the service', () => {
    const service = app.service('journeys');

    assert.ok(service, 'Registered the service');
  });
});
