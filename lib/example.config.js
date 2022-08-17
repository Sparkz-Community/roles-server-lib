
module.exports = {
  // ...existing config settings
  Roles: {
    serviceWhiteList: [], // ex: ['users', 'organizations', 'teams'] ** providing values is optional **
    serviceBlackList: [], // ex: ['vendors', 'contributors', 'users', 'organizations'] ** providing values is optional **
    rules: {
      keyPathName: 'keyPath' // for when you want to set a specific interpolation key name for dynamic values on the rules object.
      // ex: conditions: {_id: {keyPath: 'params.user._id}}   defaults to keyPath
    }
  }
};
