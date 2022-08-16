const { expect } = require('chai');
const plugin = require('../lib');

describe('roles-server-lib', () => {
  it('basic functionality', () => {
    expect(typeof plugin).to.equal('object', 'It worked');
  });
});

