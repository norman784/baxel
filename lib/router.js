"use strict";

let baxel_router = require("baxel-route")
  , serve = require("koa-static")
  , c = require("color-console")
  , config = require("./config")
  , vhost = require("koa-vhost")
  , fs = require("fs")
  , session = null;

if (fs.existsSync(process.cwd() + "/node_modules/koa-generic-session")) {
  session = require(process.cwd() + "/node_modules/koa-generic-session");
}

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

      server
        .use(router.routes())
        .use(router.allowedMethods());

      app.use(vhost({
        host: host,
        app: server
      }));

      c.green("\t\t" + host);

      if (config.server.public_path) {
        if (config.server.cors) {
          server.use(function *(next){
            this.set("Access-Control-Allow-Origin", config.server.cors.origin || "*");
            this.set("Access-Control-Allow-Headers", "X-Requested-With");
            yield next;
          });
        }

        if (domain === "root" && config.server.public_path instanceof String) {
          // If publicPath is null we don"t serve static files
          if (config.server.public_path !== null) {
            c.green("\t\t\tStatic files: " + config.server.public_path);
            server.use(serve(process.cwd() + config.server.public_path));
          }
        } else if (config.server.public_path instanceof Object) {
          if (config.server.public_path[domain]) {
              c.green("\t\t\tStatic files: " + config.server.public_path[domain]);
              server.use(serve(process.cwd() + config.server.public_path[domain])); 
          }
        }
      }

      for (var i in router._routes) {
        c.green("\t\t\t" + router._routes[i]);
      }   
    }
  }
};