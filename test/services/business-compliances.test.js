const assert = require('assert');
const app = require('../../src/app');

describe('\'business-compliances\' service', () => {
  it('registered the service', () => {
    const service = app.service('business-compliances');

    assert.ok(service, 'Registered the service');
  });
});
