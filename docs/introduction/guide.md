# Quick Start

A short guide to help user get started in using the library.


## Install

If you are using module bundlers such as Webpack, you can directly include package into your project via:

NPM:

``` bash
$ npm install @sparkz-community/roles-server-lib --save
```

or Yarn:

``` bash
$ yarn add @sparkz-community/roles-server-lib
```

## FeathersJs plugin:

Then register `@sparkz-community/iy-roles-server` services in your services index.js:

``` js
// index.js
const IrRolesServer = require('@sparkz-community/roles-server-lib');

// to configure all services
IrRolesServer.services.configureServices(app);

// to configure all services except certain ones 
// just name the services you don't want configured in an array as the second argument
IrRolesServer.services.configureServices(app, ['abilities']);


// to configure services individually
const {services: {roles, abilities, rules}} = require('@sparkz-community/roles-server-lib');
app.configure(roles)
app.configure(abilities)
app.configure(rules)
```



## i18n

How to configure the library to use different language coming tbd.
