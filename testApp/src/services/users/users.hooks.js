const { authenticate } = require('@feathersjs/authentication').hooks;
const {hooks: {authorize}, utils: {rulesTemplater, collectRules}} = require('../../../../lib');

const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;

const {iff, isProvider, preventChanges, fastJoin} = require('feathers-hooks-common');

const verifyHooks = require('@ionrev/ir-auth-management-server')['feathers-authentication-management'].hooks;
const {services: {middleware: {notifier: accountService}}} = require('@ionrev/ir-auth-management-server');

const {lodash:{lget,lset}} = require('@iy4u/common-server-lib').packages;

const rulesResolver = {
  joins: {
    children: {
      resolver: () => async (user, context) => {
        if (String(lget(context, 'params.user._id')) === String(user._id) || !isProvider('external')(context)) {
          let {roleRules} = await collectRules(context, {roles: lget(user, 'roles',[])});
          if (!context.params.user) context.params.user = user;
          if (context.params.user) {
            if (roleRules.length) {
              roleRules = rulesTemplater({rules: roleRules || [], context});
              lset(user, '_fastjoin.rules', roleRules);
            }
          }
        }
      }
    },
  }
};
const rulesConfig = {
  rulesLocation: 'params.user._fastjoin.rules',
  deBug: true
};

const attachUserRole = async context => {
  let defaultUserRole = await context.app.service('roles').find({query: {name: 'Default Basic User'}, paginate: false});
  if (defaultUserRole.length) {
    let defaultId = defaultUserRole[0]._id;
    if (defaultId && context.data) {
      lset(context, 'data.roles', [defaultId]);
    }
  }
  return context;
};

module.exports = {
  before: {
    all: [],
    find: [
      authenticate('jwt'),
      authorize(rulesConfig)
    ],
    get: [
      authenticate('jwt'),
      authorize(rulesConfig)
    ],
    create: [
      hashPassword('password'),
      verifyHooks.addVerification(),
      iff(ctx => !!ctx.params.user, authorize(rulesConfig)),
      attachUserRole
    ],
    update: [
      authenticate('jwt'),
      authorize(rulesConfig),
      iff(isProvider('external'),
        preventChanges(
          true,
          'email',
          'password',
          'isVerified',
          'verifyToken',
          'verifyShortToken',
          'verifyExpires',
          'verifyChanges',
          'resetToken',
          'resetShortToken',
          'resetExpires'
        )
      )
    ],
    patch: [
      authenticate('jwt'),
      authorize(rulesConfig),
      iff(isProvider('external'),
        preventChanges(
          true,
          'email',
          'password',
          'isVerified',
          'verifyToken',
          'verifyShortToken',
          'verifyExpires',
          'verifyChanges',
          'resetToken',
          'resetShortToken',
          'resetExpires'
        )
      ),
    ],
    remove: [
      authenticate('jwt'),
      authorize(rulesConfig)
    ]
  },

  after: {
    all: [
      fastJoin(rulesResolver),
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
    ],
    find: [],
    get: [],
    create: [
      context => {
        accountService(context.app).notifier('resendVerifySignup', context.result, {
          preferredComm: lget(context, 'params.verify_methods', []),
          customLogo: lget(context, 'params.customLogo'),
          customBaseUrl: lget(context, 'params.customBaseUrl'),
          customNextUrl: lget(context, 'params.customNextUrl')
        });
      },
      verifyHooks.removeVerification(),
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
