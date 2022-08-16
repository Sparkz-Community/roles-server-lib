const {packages: {lodash: {lget}}} = require('@iy4u/common-utils');

function checkArray(arr, service) {
  if (!Array.isArray(arr)) {
    let a = new TypeError(`${service} must be of type 'Array'`);
    console.error(a);
    throw a;
  }
}

module.exports = async (context, {roles, abilities} = {}) => {
  const {coreCall} = require('@iy4u/common-server-lib').utils;
  
  let rules = {};
  if (roles) {
    checkArray(roles, 'Roles');
    let fetchedRoles = await coreCall(context, 'ir-roles-roles').find({query: {_id: {$in: roles}}, paginate: false});
    rules.roleRules = fetchedRoles.reduce((acc, curr) => {
      return [...acc, ...lget(curr, '_fastjoin.rules', [])];
    }, []);
  }
  if (abilities) {
    checkArray(abilities, 'Abilities');
    let fetchedAbilities = await coreCall(context, 'ir-roles-abilities').find({
      query: {_id: {$in: abilities}},
      paginate: false,
    });
    rules.abilityRules = fetchedAbilities.reduce((acc, curr) => {
      return [...acc, ...lget(curr, '_fastjoin.rules', [])];
    }, []);
  }
  return rules;
};
