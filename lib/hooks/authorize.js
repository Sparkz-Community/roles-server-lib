// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const {toMongoQuery} = require('@casl/mongoose');
const {packages: {lodash: {lget, lset}}} = require('@iy4u/common-utils');
const {Forbidden, GeneralError} = require('@feathersjs/errors');

const {defineAbilities, collectRules, CreateEntity} = require('../utils');
const {isProvider} = require('feathers-hooks-common');

function checkArray(arr, type) {
  if (!Array.isArray(arr)) {
    let a = new TypeError(`${type} must be of type 'Array'`);
    console.error(a);
    throw a;
  }
}


module.exports = (
  {
    rules = [],
    rulesLocation = undefined,
    rolesLocation = undefined,
    deBug = false,
    disableSkipHook = false,
  } = {}) => {
  return async function (context) {
    const {coreCall} = require('@iy4u/common-server-lib').utils;
    
    let skipHook = (
      context.path === 'users' &&
      context.method === 'get' &&
      String(lget(context, 'params.user._id', null)) === String(context.id)
    );
    if (disableSkipHook) skipHook = false;
    if (!isProvider('external')(context) || skipHook) return context;
    let innerRules = Array.from(rules);
    const method = lget(context, 'method');
    const path = lget(context, 'path');
    const query = lget(context, 'params.query');
    checkArray(innerRules, 'Rules');
    if (!innerRules.length) {
      if (rulesLocation) {
        innerRules = lget(context, rulesLocation, []);
      } else if (rolesLocation) {
        let roles = lget(context, rolesLocation, []);
        if (roles.length) {
          const {roleRules} = await collectRules(context, {roles});
          innerRules = roleRules;
        }
      }
    }
    let ability = await defineAbilities(context, innerRules, deBug);
    if (!ability) {
      throw new GeneralError({
        message: 'No ability defined',
        errors: {[path]: {[method]: {'IrRoles': 'Ability Undefined'}}},
      });
    }
    if (ability.can('manage', 'all')) return context;
    if (ability.can('manage', path)) return context;
    if (ability.can(method, 'all')) return context;
    let pass = ability.can(method, path);
    
    if (ability && pass && method === 'find') {
      let queryRestrictions = toMongoQuery(ability, path, method);
      const queryConditions = lget(queryRestrictions, '$or', []).reduce((acc, curr) => {
        Object.keys(curr).forEach(() => acc = [...acc, curr]);
        return acc;
      }, []);
      
      const newQuery = queryConditions.length ? {$and: [...queryConditions], ...query} : query;
      lset(context, 'params.query', newQuery);
      return context;
    }
    
    if (ability && pass && ['get', 'remove'].includes(method)) {
      let item = await coreCall(context, path).get(lget(context, 'id'));
      let itemEntity = CreateEntity(path)(item);
      pass = ability.can(method, itemEntity);
    }
    
    let forbiddenMessages = {};
    
    if (ability && pass && ['patch', 'update'].includes(method)) {
      let item = await coreCall(context, path)._get(lget(context, 'id'));
      let itemEntity = CreateEntity(path)(item);
      let keys = Object.keys(lget(context, 'data', {}));
      if (ability.cannot(method, itemEntity)) {
        pass = false;
      }
      if (keys) {
        pass = keys.reduce((acc, curr) => {
          if (ability.can(method, path, curr)) {
            return acc ? true : acc;
          } else {
            forbiddenMessages.valid = true;
            forbiddenMessages[`field/${curr}`] = `You are not allowed to modify '${curr}'.`;
            return false;
          }
        }, pass);
      }
    }
    
    if (ability && pass) {
      return context;
    } else {
      let message = `You don't have the ability to ${method} on the ${path} service.`;
      if (forbiddenMessages.valid) {
        delete forbiddenMessages.valid;
        message = 'Error';
      }
      throw new Forbidden({
        message,
        errors: {
          [path]: {[method]: {status: 'Ability Denied', failedOn: forbiddenMessages}},
        },
        requestData: context.data,
      });
    }
  };
};

// eslint-disable-next-line no-unused-vars

