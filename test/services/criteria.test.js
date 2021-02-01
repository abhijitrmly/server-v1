const assert = require('assert');
const app = require('../../src/app');

describe('\'criteria\' service', () => {
  it('registered the service', () => {
    const service = app.service('criteria');

    assert.ok(service, 'Registered the service');
  });
});
