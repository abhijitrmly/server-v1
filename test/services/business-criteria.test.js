const assert = require('assert');
const app = require('../../src/app');

describe('\'business-criteria\' service', () => {
  it('registered the service', () => {
    const service = app.service('business-criteria');

    assert.ok(service, 'Registered the service');
  });
});
