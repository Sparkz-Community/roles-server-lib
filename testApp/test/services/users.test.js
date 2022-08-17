const assert = require('assert');
const app = require('../../src/app');


describe('\'users\' service', () => {
  let user1 = {email: 'dev@ionrev.com'};
  let user2 = {email: 'moogoo@ionrev.com'};

  it('registered the service', () => {
    const service = app.service('users');

    assert.ok(service, 'Registered the service');
  });

  describe('check user creation', () => {

    it('user1 was created', async () => {
      const {data} = await app.service('users').find({query: {email: user1.email}});
      user1 = data[0];
      assert.ok(user1, 'User1 should exist');
    });

    it('user2 was created', async () => {
      const {data} = await app.service('users').find({query: {email: user2.email}});
      user2 = data[0];
      assert.ok(user2, 'User2 should exist');
    });

    it('creating duplicate user fails', () => {
      return assert.rejects(app.service('users').create({email: user1.email, password: 'secret'}), (err) => {
        assert.strictEqual(err.name, 'Conflict');
        assert.strictEqual(err.message, 'email: value already exists.');
        return true;
      });
    });

  });

  describe('check user verification', () => {

    it('user1 was verified', async () => {
      assert.strictEqual(user1.isVerified, true);
    });

    it('user2 is not verified', async () => {
      assert.strictEqual(user2.isVerified, false);
    });

  });

  describe('user role permissions', async () => {
    const userService = app.service('users');

    describe('attach roles to user', () => {
      it('should attach a role to users', async () => {
        let roles = await app.service('roles').find({query: {name: 'Default Basic User'}, paginate: false});
        let role = roles[0];
        assert.ok(role, 'Default Basic User role should exist');
        user1 = await userService.patch(user1._id, {roles: [role._id]})
          .catch(err => assert.ifError(err));
        assert.ok(user1, 'User patch roles should succeed');
        assert.ok(user1.roles.map(role => String(role._id)).includes(String(role._id)));
      });

      it('user should have rules fastjoined', () => {
        assert.ok(user1._fastjoin.rules.length, 'Users rules ');
      });
    });

    describe('check user permissions', () => {
      const params = {
        provider: 'rest', authenticated: false, query: {},
      };

      before(async () => {
        const userAuth = app.service('authentication');
        const {user, accessToken} = await userAuth.create({
          strategy: 'local', email: user1.email, password: 'secret',
        });
        assert.ok(accessToken, 'Created access token for user');
        assert.ok(user, 'Includes user in authentication data');
        params.user = user;
        user1 = user;
        params.authentication = {
          accessToken, strategy: 'jwt',
        };
      });

      it('should allow user to find/get on users service', () => {
        return userService.find({paginate: false, user: user1}, params)
          .then(res => {
            assert.ok(res.length, 'User query response should have length');
          })
          .catch(err => assert.fail('User should be able to query user service: ' + err.message));
      });

      it('should allow user to patch name', () => {
        const newName = 'user changed name';
        return userService.patch(user1._id, {name: newName}, params)
          .then(res => {
            assert.ok(res, 'User patch should have a response');
            assert.strictEqual(res.name, newName);
          })
          .catch(err => assert.fail('User should be able to patch user name: ' + err.message));
      });

      it('should stop user changing unallowed fields', () => {
        let payload = {
          name: 'changed name', email: 'changed@email.com', _id: 'changed id', roles: ['changed roles'],
        };
        return assert.rejects(userService.patch(params.user._id, payload, params), (err) => {
          assert.strictEqual(err.errors.users.patch.status, 'Ability Denied');
          assert.strictEqual(err.errors.users.patch.failedOn['field/email'], 'You are not allowed to modify \'email\'.');
          assert.strictEqual(err.errors.users.patch.failedOn['field/_id'], 'You are not allowed to modify \'_id\'.');
          assert.strictEqual(err.errors.users.patch.failedOn['field/roles'], 'You are not allowed to modify \'roles\'.');
          assert.strictEqual(err.errors.users.patch.failedOn['field/name'], undefined);
          assert.strictEqual(err.message, 'Error');
          assert.strictEqual(err.name, 'Forbidden');
          return true;
        });
      });

      it('should stop user changing other users info', () => {
        return assert.rejects(userService.patch(user2._id, {email: 'changed@email.com'}, params), (err) => {
          assert.strictEqual(err.errors.users.patch.status, 'Ability Denied');
          assert.strictEqual(err.errors.users.patch.failedOn['field/email'], 'You are not allowed to modify \'email\'.');
          assert.strictEqual(err.message, 'Error');
          assert.strictEqual(err.name, 'Forbidden');
          return true;
        });
      });

      it('should stop user creating new user', () => {
        return assert.rejects(userService.create({email: 'changed@email.com', password: 'secret'}, params), (err) => {
          assert.strictEqual(err.errors.users.create.status, 'Ability Denied');
          assert.strictEqual(err.message, 'You don\'t have the ability to create on the users service.');
          assert.strictEqual(err.name, 'Forbidden');
          return true;
        });
      });

      it('should stop user from removing self with softDelete', () => {
        return assert.rejects(userService.remove(user1._id, params), (err) => {
          assert.strictEqual(err.errors.users.patch.status, 'Ability Denied');
          assert.strictEqual(err.errors.users.patch.failedOn['field/deleted'], 'You are not allowed to modify \'deleted\'.');
          assert.strictEqual(err.errors.users.patch.failedOn['field/deletedAt'], 'You are not allowed to modify \'deletedAt\'.');
          assert.strictEqual(err.message, 'Error');
          assert.strictEqual(err.name, 'Forbidden');
          return true;
        });
      });

      it('should stop user from removing others with softDelete', () => {
        return assert.rejects(userService.remove(user2._id, params), (err) => {
          assert.strictEqual(err.errors.users.patch.status, 'Ability Denied');
          assert.strictEqual(err.errors.users.patch.failedOn['field/deleted'], 'You are not allowed to modify \'deleted\'.');
          assert.strictEqual(err.errors.users.patch.failedOn['field/deletedAt'], 'You are not allowed to modify \'deletedAt\'.');
          assert.strictEqual(err.message, 'Error');
          assert.strictEqual(err.name, 'Forbidden');
          return true;
        });
      });

      it('should stop user from removing self without softDelete', () => {
        params.softDeleteOff = true;
        return assert.rejects(userService.remove(user1._id, params), (err) => {
          assert.strictEqual(err.errors.users.remove.status, 'Ability Denied');
          assert.strictEqual(err.message, 'You don\'t have the ability to remove on the users service.');
          assert.strictEqual(err.name, 'Forbidden');
          return true;
        });
      });

      it('should stop user from removing others without softDelete', () => {
        params.hello = true;
        return assert.rejects(userService.remove(user2._id, params), (err) => {
          assert.strictEqual(err.errors.users.remove.status, 'Ability Denied');
          assert.strictEqual(err.message, 'You don\'t have the ability to remove on the users service.');
          assert.strictEqual(err.name, 'Forbidden');
          return true;
        });
      });

      it('should add rule to allow user to remove without softDelete', async () => {
        let rule = await app.service('rules').create({
          name: 'users/remove', action: ['remove'], subject: 'users', conditions: {
            _id: {
              [app.get('Roles').rules.keyPathName]: 'params.user._id',
            },
          },
          inAbilities: ['607476409a71e007b847fa5e'],
        });
        assert.ok(rule._id, 'Remove rule should have been created');
      });

      it('should verify remove rule was added and allow user to remove without softDelete', async () => {
        const removeRule = user1._fastjoin.rules.filter(rule => rule.action.includes('remove'));
        assert.ok(removeRule, 'Remove Rule should exist');
        const removedUser = await userService.remove(user1._id, params).catch(err => assert.ifError(err));
        assert.ok(removedUser, 'Removed User should be returned');
      });

      it('should fail on getting user', () => {
        return assert.rejects(userService.get(user1._id), (err) => {
          assert.strictEqual(err.message, `No record found for id '${user1._id}'`);
          assert.strictEqual(err.name, 'NotFound');
          return true;
        });
      });

    });
  });
});
