# Roles

## Schema

|   Name    |      Type      |  Contains   |    Ref    | RefPath | Default | Required | Description                                                                            |
|:---------:|:--------------:|:-----------:|:---------:|:-------:|:-------:|:--------:|----------------------------------------------------------------------------------------|
|   name    |     String     |             |           |         |  none   |   true   | Name of the Role                                                                       |
| abilityId | ObjectId Array |             | abilities |         |   []    |   true   | An array of abilities ObjectId                                                         |
| whitelist |  Object Array  | id, idModel |           |         |   []    |  false   | An Array of ids and corresponding service that by default bypass restrictions of rules |
|     ^     |    ObjectId    |    `id`     |           | idModel |         |   true   | The ObjectId of the accessor                                                           |
|     ^     |     String     |  `idModel`  |           |         |         |   true   | The service that corresponds to the accessors document                                 |
| blacklist |  Object Array  | id, idModel |           |         |   []    |  false   | An Array of ids and corresponding service that by default are fully restricted         |
|     ^     |    ObjectId    |    `id`     |           | idModel |         |   true   | The ObjectId of the accessor                                                           |
|     ^     |     String     |  `idModel`  |           |         |         |   true   | The service that corresponds to the accessors document                                 |
| createdBy |    ObjectId    |             |   users   |         |         |  false   | ObjectId of user who created the role                                                  |
| updatedBy |    ObjectId    |             |   users   |         |         |  false   | ObjectId of user who last updated the role                                             |
|  active   |    Boolean     |             |           |         |  true   |  false   | Indicator for whether the role is active or not                                        |

## Attached rules
All rules associated with a role come pre-attached by use of the `feathers-hooks-common` package `fastJoin` hook.
They are attached to each record under the field path `_fastjoin.rules`


