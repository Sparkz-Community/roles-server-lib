# ir-roles-server

[![Build Status](https://travis-ci.org/feathersjs/ir-roles-server.png?branch=master)](https://travis-ci.org/feathersjs/ir-roles-server)
[![Code Climate](https://codeclimate.com/github/feathersjs/ir-roles-server/badges/gpa.svg)](https://codeclimate.com/github/feathersjs/ir-roles-server)
[![Test Coverage](https://codeclimate.com/github/feathersjs/ir-roles-server/badges/coverage.svg)](https://codeclimate.com/github/feathersjs/ir-roles-server/coverage)
[![Dependency Status](https://img.shields.io/david/feathersjs/ir-roles-server.svg?style=flat-square)](https://david-dm.org/feathersjs/ir-roles-server)
[![Download Status](https://img.shields.io/npm/dm/ir-roles-server.svg?style=flat-square)](https://www.npmjs.com/package/ir-roles-server)

> roles plugin for FeathersJs server

## Installation

```
npm install ir-roles-server --save
```

## Documentation

TBD

## Complete Example

Here's an example of a Feathers server that uses `ir-roles-server`. 

```js
const feathers = require('@feathersjs/feathers');
const irRoles = require('ir-roles-server');

// Initialize the application
const app = feathers();

// Initialize the plugin
irRoles.services.configureServices(app);
```

## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).
