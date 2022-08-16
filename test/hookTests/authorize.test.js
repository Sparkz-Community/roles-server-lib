const assert = require('assert');
// const {authorize} = require('../../lib/hooks');
// const app = require('../../testApp/src/app')

describe('authorize hook', () => {
  const rules = [
    {
      action: ['get', 'find'],
      subject: ['users'],
      inverted: false
    },
    {
      action: ['patch', 'update'],
      subject: ['users']
    }
  ];
  console.log(rules);
  it('should be true', () => {
    assert.ok(true, 'default true');
  });
});
