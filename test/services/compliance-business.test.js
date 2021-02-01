const assert = require('assert');
const app = require('../../src/app');

describe('\'compliance-business\' service', () => {
  it('registered the service', () => {
    const service = app.service('compliance-business');

    assert.ok(service, 'Registered the service');
  });
});
