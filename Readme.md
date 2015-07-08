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

License
---

MIT
