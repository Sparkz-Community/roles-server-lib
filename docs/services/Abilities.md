# Abilities

## Schema

|   Name    |      Type      |  Ref  | Default | Required | Description                                        |
|:---------:|:--------------:|:-----:|:-------:|:--------:|----------------------------------------------------|
|   name    |     String     |       |  none   |   true   | Name of the ability                                |
|  inRoles  | ObjectId Array | roles |   []    |  false   | An array of roles ObjectId                         |
|   rules   | ObjectId Array | rules |   []    |   true   | An array of rules ObjectId                         |
| createdBy |    ObjectId    | users |         |  false   | ObjectId of user who created the ability           |
| updatedBy |    ObjectId    | users |         |  false   | ObjectId of user who last updated the ability      |
|  active   |    Boolean     |       |  true   |  false   | Indicator for whether the ability is active or not |

## Attached rules
All rules associated with an ability come pre-attached by use of the `feathers-hooks-common` package `fastJoin` hook.
They are attached to each record under the field path `_fastjoin.rules`


