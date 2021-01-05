const assert = require('assert');
const app = require('../../src/app');

describe('\'certifications\' service', () => {
  it('registered the service', () => {
    const service = app.service('certifications');

    assert.ok(service, 'Registered the service');
  });
});
