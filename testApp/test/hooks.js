const assert = require('assert');
const app = require('../src/app');
const mongoose = require('mongoose');

exports.mochaHooks = {
  beforeAll() {
    before(async() => {
      await mongoose.connection.collection('users').deleteMany({});
      await mongoose.connection.collection('roles').deleteMany({});
      await mongoose.connection.collection('abilities').deleteMany({});
      await mongoose.connection.collection('rules').deleteMany({});
    });
    const userService = app.service('users');
    let user1 = {
      name: 'development', email: 'dev@ionrev.com', password: 'secret',
    };
    let user2 = {
      name: 'moogoo', email: 'moogoo@ionrev.com', password: 'secret',
    };
    it('should create users', async () => {
      assert.ok(userService, 'global users service');
      let users = await app.service('users').find({
        query: {email: {$in: [user1.email, user2.email]}}, paginate: false,
      });
      if (users.length !== 2) {
        user1 = await app.service('users').create(user1).catch(() => {/*user already created*/});
        user2 = await app.service('users').create(user2).catch(() => {/*user already created*/});
        if (!user1.isVerified) {
          const {data} = await app.service('users').find({query: {email: user1.email}});
          user1 = data[0];
          await app.service('authManagement').create({action: 'verifySignupLong', value: user1.verifyToken}).catch(err => assert.ifError(err));
          const {data: afterVerify} = await app.service('users').find({query: {email: user1.email}});
          user1 = afterVerify[0];
        }
      }
      let users2 = await app.service('users').find({
        query: {email: {$in: [user1.email, user2.email]}}, paginate: false,
      });
      user1 = users2.find(user => user.email === user1.email);
      user2 = users2.find(user => user.email === user2.email);
      assert.ok(user1, 'Global User1 should exist');
      assert.ok(user2, 'Global User1 should exist');

    });
    it('should create user roles', async () => {

      const rolesService = app.service('roles');
      const abilitiesService = app.service('abilities');
      const rulesService = app.service('rules');
      assert.ok(rolesService, 'global rolesService service');
      assert.ok(abilitiesService, 'global abilitiesService service');
      assert.ok(rulesService, 'global rulesService service');

      let newRole = {
        _id: '607475cd9a71e007b847fa5d',
        name: 'Default Basic User',
        whitelist: [],
        blacklist: [],
      };

      let newAbility = {
        _id: '607476409a71e007b847fa5e',
        inRoles: ['607475cd9a71e007b847fa5d'],
        name: 'basic user',
      };

      let newRule1 = {
        _id: '6074ae79730b4519a7a55176',
        inAbilities: ['607476409a71e007b847fa5e'],
        action: ['patch', 'update'],
        subject: 'users',
        fields: ['name', 'theme.**'],
        inverted: false,
        conditions: {_id: {keyPath: 'params.user._id'}},
        name: 'users-patch/update',
        note: 'the ability to patch or update a user if the authenticated users _id matches the record being altered _id',
        reason: {_id: 'You are not allowed to modify other users.'},

      };
      let newRule2 = {
        _id: '6074b0379400931accc391ed',
        inAbilities: ['607476409a71e007b847fa5e'],
        action: ['get', 'find'],
        subject: 'users',
        inverted: false,
        name: 'users-get/find',
      };

      await rolesService.create(newRole).catch(() => {/*role already created*/});
      await abilitiesService.create(newAbility).catch(() => {/*ability already created*/});
      await rulesService.create(newRule1).catch(() => {/*rule already created*/});
      await rulesService.create(newRule2).catch(() => {/*rule already created*/});

      let role = await rolesService.get(newRole._id).catch(err => assert.ifError(err));
      let ability = await abilitiesService.get(newAbility._id).catch(err => assert.ifError(err));
      let rules = await rulesService.find({query:{_id:{$in:[newRule1._id, newRule2._id]}}, paginate: false}).catch(err => assert.ifError(err));

      assert.ok(role, 'Role should be created');
      assert.deepStrictEqual(role.abilityIds.map(id => String(id)), [String(ability._id)]);

      assert.ok(ability, 'Ability should be created');
      assert.ok(ability.inRoles.length, 'Ability inRoles.length should not be 0');
      assert.ok(ability.rules.length, 'Ability rules.length should not be 0');
      assert.deepStrictEqual(ability.inRoles.map(id => String(id)), [String(role._id)]);
      assert.deepStrictEqual(ability.rules.map(id => String(id)), [newRule1._id, newRule2._id]);

      assert.ok(rules.length, 'There should be a list of rules');
      assert.strictEqual(rules.length, 2);
      assert.deepStrictEqual(rules[0].inAbilities.map(id => String(id)), [String(ability._id)]);
      assert.deepStrictEqual(rules[1].inAbilities.map(id => String(id)), [String(ability._id)]);

    });
  },
  async afterAll() {
    await mongoose.connection.collection('users').deleteMany({});
    await mongoose.connection.collection('roles').deleteMany({});
    await mongoose.connection.collection('abilities').deleteMany({});
    await mongoose.connection.collection('rules').deleteMany({});
  }
};


