const assert = require('assert');
const app = require('../../src/app');

describe('\'material\' service', () => {
  it('registered the service', () => {
    const service = app.service('material');

    assert.ok(service, 'Registered the service');
  });
});
