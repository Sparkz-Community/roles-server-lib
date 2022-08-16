# Authorize

#### authorize({rules, rulesLocation, rolesLocation, debug})

## Options

The authorize hook takes an object as it's only argument with 4 optional key/values.

Name            | Description
:-----:         | ---
rules           | Value should be an array of rules to validate against the current hook. Only the rules that apply for the current hook will be applied. If provided, `rules` will take precedence over `rulesLocation`.
rulesLocation   | Value should be a string giving the location of rules inside context. Context is always the starting point. example: `'params.user['rules']'` will pull the rules from `context.params.user['rules']`. If provided, `rulesLocation` will take precedence over `rolesLocation`.
rolesLocation   | Value should be a string giving the location of roles inside context by which to collect rules from. Context is always the starting point. example: `'params.user['roles']'` will pull the roles from `context.params.user['roles']`.
debug           | Value should be a Boolean which if true will turn on some helpful terminal logging.

> If not able to find a list of rules `authorize` will fail the attempt and produce an error.
