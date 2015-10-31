0.8.1 - 2015-10-27
---

- When there in a single domain it is attached to the main app istead of a vhost app

0.8.0 - 2015-10-19
---

- Added interactive CLI (thanks to [vorpal](https://github.com/dthree/vorpal))
- Added serializers support

0.7.0 - 2015-10-09
---

- Added support for custom middlewares
- Removed hardcoded middlewares
- Added before_action support to controllers

0.6.1 - 2015-10-07
---

- Fix initializer typo issue (hate spellcheckers)
- Updated path for template

0.6.0 - 2015-09-23
---

- Added [koa-csrf](https://github.com/koajs/csrf) dependency
- For security reasons now users and passwords set from .env file
- [Optional] Added [koa-generic-session](https://github.com/koajs/generic-session) support
- [Optional] Added i18n support [koa-i18n](https://github.com/koa-modules/i18n)
- Configuration changed a lot
  - Routes now is located in config/routes.json and handled by [baxel-route](http://github.com/norman784/baxel-route)
  - Configuration can be json or js files
- Fixed issue where public is available in all vhosts, now its only available on enabled domains

0.5.2 - 2015-09-09
---

- Reworked how baxel environment is set

0.5.1 - 2015-09-09
---

- Fixed template route

0.5.0 - 2015-09-04
---

- Added custom server initialisation support
- Added custom koa framework instance support
- Added vhost support
- Ignore no js files when loading config, models, etc
- Breaking backwards compatibility:
	- require('baxel').initializer changed to require('baxel').initializer
	- require('baxel').Model changed to require('baxel').model

0.4.0 - 2015-07-02
---

- Added environment support
- Reworked routes to support resources and global methods for paths
- Added tasks partial support

0.3.0 - 2015-06-25
---

- Fix typo issue
- Changed how initializers works
- Load models on start

0.2.7 - 2015-06-15
---

- Added missing dependency

0.2.6 - 2015-06-12
---

- Fixed issue where middlewares added on app.js was not working

0.2.4 - 2015-06-10
---

- Hotfix where bin not included on npm package

0.2.3 - 2015-06-10
---

- Added body parser
- Fixed issue where model, ctrl and helper method was not exposed
- Fixed issue where initializers was not exported

0.2.2 - 2015-06-03
---

- Fixed issues with missing configurations package.json
- Added bin folder to repo

0.2 - 2015-06-02
---

- Added an easy way to instantiate third party libraries
- Improved Baxel core

0.1 - 2015-06-01
---

- Implemented MVC architecture project
- Build a well organized configuration files and routes
- Added helpers support
- Added an easy way to call models and helpers from the controllers
- Added template support
