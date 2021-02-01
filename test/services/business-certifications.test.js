const assert = require('assert');
const app = require('../../src/app');

describe('\'business-certifications\' service', () => {
  it('registered the service', () => {
    const service = app.service('business-certifications');

    assert.ok(service, 'Registered the service');
  });
});
