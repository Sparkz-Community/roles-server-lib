const assert = require('assert');
const app = require('../src/app');

describe('authentication', () => {


  it('registered the authentication service', () => {
    const service = app.service('authentication');
    assert.ok(service);
  });

  describe('local strategy', () => {
    const user1 = {
      name: 'development',
      email: 'dev@ionrev.com',
      password: 'secret'
    };

    it('authenticates user and creates accessToken', async () => {
      const userAuth = app.service('authentication');
      const { user, accessToken } = await userAuth.create({
        strategy: 'local',
        ...user1
      });
      assert.ok(accessToken, 'Created access token for user');
      assert.ok(user, 'Includes user in authentication data');
    });
  });


});
