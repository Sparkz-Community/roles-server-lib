const { GeneralError } =  require('@feathersjs/errors');
const {packages: {lodash: {lget}}} = require('@iy4u/common-utils');
const deepDash = require('deepdash/standalone');

module.exports = function ({rules, context, restrictTo} = {}) {
  let errors = [];
  if (Array.isArray(restrictTo) && !restrictTo.length) restrictTo = undefined;
  if (typeof restrictTo === 'string') restrictTo = [restrictTo];
  if (restrictTo === undefined || Array.isArray(restrictTo)) {
    const keyPath = lget(context.app.get('Roles'), 'rules.keyPathName', 'keyPath');
    let deepDashReplace = (val, key, parentValue, ctx) => {
      if (val && val[keyPath]) {
        let keyPathRestricted = false;
        if (Array.isArray(restrictTo)) {
          for (let path of restrictTo) {
            if (!keyPathRestricted) {
              keyPathRestricted = val[keyPath].includes(path);
            } else break;
          }
        }
        if (!restrictTo || keyPathRestricted) {
          let actualValue = lget(context, val[keyPath]);
          if (actualValue !== undefined) {
            val = actualValue;
          } else {
            errors.push({[key]: `Missing definitions for ${key} : got ${actualValue}`});
          }
          ctx.skipChildren(true);
        }
      }
      return val;
    };
    if (rules.length) {
      rules = deepDash.mapValuesDeep(rules, deepDashReplace, {includeRoot: true});
      if (errors.length) {
        throw new GeneralError({
          message: 'Rule Condition Definition Error',
          // data: {context: context},
          errors: errors
        });
      }
    }
  }

  return rules;

};
