"use strict";

let baxel_router = require("baxel-route")
  , c = require("color-console")
  , config = require("./config")
  , vhost = require("koa-vhost")
  , fs = require("fs")
  , session = null
  , middleware = require("./middleware");

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
        controller_path: process.env.CONTROLLER_PATH,
        helper_path: process.env.HELPER_PATH
      });

      let subapp = koa()
        , host = (domain !== "root" ? domain + "." : "") + process.env.HOST;

      c.green("\t\t" + host);
      
      // Apply middleware if exists
      middleware(app, subapp, domain);

      subapp
        .use(router.routes())
        .use(router.allowedMethods());

      app.use(vhost({
        host: host,
        app: subapp
      }));
      
      for (var i in router._routes) {
        c.green("\t\t\t" + router._routes[i]);
      }   
    }
  }
};