// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const {Ability} = require('@casl/ability');
const rulesTemplater = require('./rulesTemplater');
const {logger} = require('@iy4u/common-utils');

const LEVEL = 'verbose';
function logIt (context, rules) {
  logger.log(LEVEL,'---------------- Start Defining Ability ----------------\n');
  logger.log(LEVEL, '----- Rules -----',{subject: context.path, action: context.method, rules: rules});
  logger.log(LEVEL, '\n---------------- End Defining Ability ----------------');
}

module.exports = async (context, rules = [], deBug = false) => {
  const {method, path} = context;


  if (!Array.isArray(rules)) return {rules, errors: [{rulesError: `Invalid type - Array[rules] - got ${typeof rules}`}]};
  if (rules.length) {
    let pertinentRules = rules.reduce((acc, curr) => {
      let isManage = curr.action.includes('manage');
      let isAll = curr.subject.includes('all');
      if (curr.action.includes(method) && curr.subject.includes(path) || (isManage || isAll)) {
        if (Array.isArray(curr.fields) && curr.fields.length === 0) {
          delete curr.fields;
        }
        acc.push(curr);
      }
      return acc;
    }, []);
    // let pertinentRules = new Ability(rules).rulesFor(method, path)
    rules = rulesTemplater({rules: pertinentRules, context});
  }
  if (deBug) {
    logIt(context, rules);
  }

  return new Ability(rules);

};

