"use strict";

let baxel_router = require("baxel-route")
  , serve = require("koa-static")
  , c = require("color-console")
  , config = require("./config")
  , vhost = require("koa-vhost")
  , session = require('koa-session');

module.exports = function(app, koa) {
  
  c.green("\tRoutes:");

  if (!process.env.HOST) {
    c.red("please set environment variable HOST in .env file");
  } else {
    for (let domain in config.routes) {
      let router = baxel_router(config.routes[domain], {
        path: process.env.CONTROLLER_PATH
      });

      let server = koa()
        , host = (domain !== "root" ? domain + "." : "") + process.env.HOST;

      if (config.server.session) {
        server.keys = config.server.session.keys;
        server.use(session(server));
      }

      server
        .use(router.routes())
        .use(router.allowedMethods());

      app.use(vhost({
        host: host,
        app: server
      }));

      c.green("\t\t" + host);

      if (domain === "root") {
        // If publicPath is null we don"t serve static files
        if (config.server.public_path !== null) {
          c.green("\t\t\tStatic files: " + config.server.public_path);
          server.use(serve(process.cwd() + config.server.public_path));
        }
      }

      for (var i in router._routes) {
        c.green("\t\t\t" + router._routes[i]);
      }   
    }
  }
};