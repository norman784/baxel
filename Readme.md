Baxel
---

[![Join the chat at https://gitter.im/norman784/baxel](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/norman784/baxel?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) ![](https://img.shields.io/npm/dm/baxel.svg?style=flat-square)

Baxel is a MVC web framework build on top of [Koa](http://koajs.com) framework,
it born because there is no simple project that, IMO, doesn't is flexible
and simple to use, and witch adopt the MVC architecture.

The intention of this framework isn't not to build new tools to do the job,
just to be a glue of existing projects. There is too many projects that
creates their own ORM, ODM or just database driver, instead of integrate
some of the nice available out there.

Also it only will provide a structure, inspired on Ruby on Rails, that will
allow you to organise better your projects, initialise your own or third party
libraries, call in a easy way your models, helpers, etc.

Features
---

- MVC architecture project
- Helpers support
- ORM, ODM or DB driver independent
- Easy way to instantiate third party libraries
- Easy way to call models and helpers from the controllers
- Well organized configuration files and routes
- Template support
- Custom middleware support

Usage
---

Instalation

```
npm install -g baxel
```

Create a new Baxel project

```
baxel new blog
cd blog
```

Runinig Baxel for development, uses nodemon behind so the app will be
restarted when changed made on the project

```
baxel run
```

Runing Baxel for production, its just like another nodejs app

```
node app.js
```

Socket.io integration
---

```javascript
// app.js must looks like
var baxel = require('baxel')()
	, http = require('http').Server(baxel.app)
	, io = require('socket.io');

baxel.run(function(app, port){
	http.listen(port, function(){
		console.log('listening on port: ' + port);
	});
});
```

Using custom koa frameworks
---

```javascript
// app.js must looks like
var koa = require('koa.io')
	, app = koa()
	, baxel = require('baxel')(app);

baxel.run(function(app, port){
	app.listen(port, function(){
		console.log('listening on port: ' + port);
	});
});
```

Custom middleware support
---

If you want to use i.e. koa-minify you need to setup their initialization 
file inside `config/middlewares`

```javascript
module.exports = {
	dir: __dirname
}
```

Baxel internally will search this module in the root node_modules folder
and will initialize with the above options.

If the module has more than one param, like koa-locales, can be used in this way:

```javascript
module.exports = function(app, mod) {
	return mod(app, {
		dirs: [__dirname + '/locales', __dirname + '/foo/locales']
	});
}
```

This allows to use any koa middleware without the need to write a wrapper around it.

Another note, to use middlewares with specific subdomain you need to put inside a
subfolder with the subdomain name 

`i.e. config/middlewares/koa-minify` will be instantiated in the root and each subdomain
`i.e. config/middlewares/root/koa-minify` will be instantiated only in the root
`i.e. config/middlewares/cms/koa-minify` will be instantiated only in the cms subdomain

Controllers
---

***Before action***

* Helper: string or string array containing the helper middleware that will be aplied to each action
* Except: string array with excluded actions
* Included: string array with excluded actions

```
exports.before_action = {
	"helper": "authorization"
}
```

```
exports.before_action = {
	"helper": "authorization",
	"except": ["index", "details"]
}
```

```
exports.before_action = {
	"helper": "authorization",
	"only": ["delete"]
}
```

```
exports.before_action = {
	"helper": ["authorization", "set_locale"],
	"only": ["delete"]
}
```

License
---

MIT
