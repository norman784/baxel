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
    let domains = Object.keys(config.routes);

    if (domains.length == 1) {
      let domain = domains[0]
        , router = baxel_router(config.routes[domain], {
        controller_path: process.env.CONTROLLER_PATH,
        helper_path: process.env.HELPER_PATH
      });

      let host = (domain !== "root" ? domain + "." : "") + process.env.HOST;

      c.green("\t\t" + host);
      
      // Apply middleware if exists
      middleware(app, app, domain);

      app
        .use(router.routes())
        .use(router.allowedMethods());

      for (var i in router._routes) {
        c.green("\t\t\t" + router._routes[i]);
      }

      return router._routes;
    } else {
      let routes = {};

      for (let k in domains) {
        let domain = domains[k]
          , router = baxel_router(config.routes[domain], {
            controller_path: process.env.CONTROLLER_PATH,
            helper_path: process.env.HELPER_PATH
          })
          , subapp = koa()
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

        routes[host] = router._routes;
        
        for (var i in router._routes) {
          c.green("\t\t\t" + router._routes[i]);
        }
      }

      return routes;
    }
  }

  return null;
};