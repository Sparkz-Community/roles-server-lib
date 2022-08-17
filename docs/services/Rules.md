# Rules

## Overview

Rules are configured and used on a `can` or `cannot` basis. A `can` rule is simply one with the field `inverted` set to false. 
It follows the logic of any action in the `action` array `can` be done to any subject in the `subject` array . Conditions and fields
may still fail a rule if they are not satisfied. A `cannot` rule takes the exact opposite approach of any action in the `action` array `cannot` be done to any 
subject in the `subject` array. If there are conditions or fields on a `cannot` rule they take the logic of only invoking the `cannot` rule
if they are met.

### Example:
Let's see some variations of what a set rules would look like to setup permissions for using a service called 'users'.  
This would be done after first setting up a Role and then an Ability.  
We're going to relate them to an Ability with an id of 1.
```js
let newRules = [
  { // add a 'can' rule for being able to find and get on the users service with no restrictions
    name: 'Basic todos retrieval',
    inAbilities: [1],
    action: ['find', 'get'],
    subject: 'users',
    inverted: false
  },
  { // add a 'cannot' rule to restrict creating new users
    name: 'Basic users creation',
    inAbilities: [1],
    action: ['create'],
    subject: 'users',
    inverted: true,      // inverted = true indicating this is a 'cannot' rule
    reason: 'You do not have the ability to create a new user.' // Optional field. Give a reason for restricting 
  },
  { // add a 'can' rule that allows patching or updating to the users service
    // this rule constrains modifying a record based on conditions and fields
    name: 'Basic todos patching/updating',
    inAbilities: [1],
    action: ['patch', 'update'],
    subject: 'users',
    conditions: {                    // Condition where the rule fails unless the records 'createdBy'
      createdBy: {                   // field matches the value of context.params.user._id. 
        keyPath: 'params.user._id'   // Context is always the starting point for 'keyPath'
      }
    },
    fields: ['title', 'description'], // Setup where only fields of 'title' and 'description'
                                      // can be modified. Trying to modify other fields will fail.
    inverted: false
  },                                                   
  { // add a 'can' rule that allows removing on the todos service
    // this rule constrains removing a record based on conditions
    name: 'Basic todos patching/updating',
    inAbilities: [1],
    action: ['remove'],
    subject: 'todos',
    conditions: {                    // Condition where the rule fails unless the records 'createdBy'
      createdBy: {                   // field matches the value of context.params.user._id. 
        keyPath: 'params.user._id'   // Context is always the starting point for 'keyPath'
      }
    },                                               // Key  must match corresponding conditions key.
    inverted: false  
  },
]
```

## Schema

|    Name     |      Type      |    Ref    | Default | Required | Description                                                                                                                                                                                                                                                                                          |
|:-----------:|:--------------:|:---------:|:-------:|:--------:|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|    name     |     String     |           |         |   true   | Name of the Rule                                                                                                                                                                                                                                                                                     |
|    note     |     String     |           |         |  false   | Notes for the rule                                                                                                                                                                                                                                                                                   |
| inAbilities | ObjectId Array | abilities |   []    |   true   | An Array of abilities ObjectId with which the rule is associated                                                                                                                                                                                                                                     |
|   action    |     Array      |           |   []    |   true   | An Array of strings that specify what the rule allows you to do                                                                                                                                                                                                                                      |
|   subject   |     String     |           |   []    |   true   | A Subject the rule applies to. Could be service name                                                                                                                                                                                                                                                 |
|   fields    |     Array      |           |   []    |  false   | An Array of strings that indicate what fields of a subject can be modified                                                                                                                                                                                                                           |
| conditions  |     Object     |           |         |  false   | An Object with keys that match fields of a subject. The value should either be hardcoded or as an Object ```{keyPath: 'some.dot\['notation']'}``` where `keyPath` value leads to somewhere in a hooks context where the condition's value exists. The starting point for `keyPath` is always context |
|      "      | Object/String  |           |         |  false   |                                                                                                                                                                                                                                                                                                      |
|   reason    |     String     |           |         |  false   | A message to return for a cannot rule. Helps describe why the rule is a restriction.                                                                                                                                                                                                                 |
|  inverted   |    Boolean     |           |  false  |  false   | Indicator for whether the rule is a cannot rule meaning that you cannot do any of the actions array on any of the subjects array                                                                                                                                                                     |
|  createdBy  |    ObjectId    |   users   |         |  false   | ObjectId of user who created the rule                                                                                                                                                                                                                                                                |
|  updatedBy  |    ObjectId    |   users   |         |  false   | ObjectId of user who last updated the rule                                                                                                                                                                                                                                                           |
|   active    |    Boolean     |           |  true   |  false   | Indicator for whether the rule is active or not                                                                                                                                                                                                                                                      |

