# roles-server-lib

[![Build Status](https://travis-ci.org/feathersjs/roles-server-lib.png?branch=master)](https://travis-ci.org/feathersjs/roles-server-lib)
[![Code Climate](https://codeclimate.com/github/feathersjs/roles-server-lib/badges/gpa.svg)](https://codeclimate.com/github/feathersjs/roles-server-lib)
[![Test Coverage](https://codeclimate.com/github/feathersjs/roles-server-lib/badges/coverage.svg)](https://codeclimate.com/github/feathersjs/roles-server-lib/coverage)
[![Dependency Status](https://img.shields.io/david/feathersjs/roles-server-lib.svg?style=flat-square)](https://david-dm.org/feathersjs/roles-server-lib)
[![Download Status](https://img.shields.io/npm/dm/roles-server-lib.svg?style=flat-square)](https://www.npmjs.com/package/roles-server-lib)

> roles plugin for FeathersJs server

## Installation

```
npm install roles-server-lib --save
```

## Documentation

TBD

## Complete Example

Here's an example of a Feathers server that uses `roles-server-lib`. 

```js
const feathers = require('@feathersjs/feathers');
const roles = require('roles-server-lib');

// Initialize the application
const app = feathers();

// Initialize the plugin
roles.services.configureServices(app);
```

## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).
