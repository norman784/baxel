0.5.0 - 2015-09-04
---

- Added support for custom server initialisation
- Added support for custom koa framework instance
- Ignore no js files when loading config, models, etc
- Breaking backwards compatibility:
	- require('baxel').Initializer changed to require('baxel').initializer
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
