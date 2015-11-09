"use strict";

let baxel_router = require("baxel-route")
  , chalk = require("chalk")
  , config = require("./config")
  , koa = require("koa.io")
  , vhost = require("koa-vhost")
  , fs = require("fs")
  , middleware = require("./middleware")
  , sprintf = require("sprintf");

let helper = function(before_action, action) {
  let result = {
    path: [],
    files: []
  };

  if (!before_action) return result;
  if (before_action.constructor === Array) {
    for (let i in before_action) {
      let tmp = helper(before_action[i], action);
      result.path = result.path.concat(tmp.path);
      result.files = result.files.concat(tmp.files);
    }
  } else if (before_action.only && before_action.only.constructor === Array && before_action.only.indexOf(action) === -1) return result;
  else if (before_action.only && before_action.only !== action) return result;
  else if (before_action.except && before_action.except.constructor === Array && before_action.except.indexOf(action) > -1) return result;
  else if (before_action.except && before_action.except === action) return result;

  if (before_action.helper.constructor === Array) {
    for (let i in before_action.helper) {
      result.path.push(before_action.helper[i]);
      result.files.push(require(process.env.HELPER_PATH + before_action.helper[i]));
    }
  } else {
    result.path.push(before_action.helper);
    result.files.push(require(process.env.HELPER_PATH + before_action.helper));
  }

  return result;
}

let mount = function(app, routes, multiple_domains) {
  let router = require("koa-router")();

  for (let i in routes) {
    let route = routes[i]
      , controller = require(process.env.CONTROLLER_PATH + route.controller.split("#")[0] + "Controller")
      , action = route.controller.split("#")[1]
      , cb = controller[action].constructor === Object ? controller[action].handler : controller[action]
      , args = [route.url]
      , helpers = helper(controller.before_action, action);

    args = args.concat(helpers.files);
    args.push(cb);

    if (route.verb === "SOCKET") {
      app.io.route.apply(app.io, args);
    } else {
      router[route.verb.toLowerCase()].apply(router, args);
    }

    let str = sprintf("%-13s %-40s %s %s", routes[i].verb, routes[i].url, routes[i].controller, helpers.path.length > 0 ? ">> " + helpers.path.join(",") : "");
    console.log(chalk.green(multiple_domains ? "\t\t\t" : "\t\t", str));
  }

  return router;
}

module.exports = function(app) {

  let DOMAIN_IGNORE = process.env.DOMAIN_IGNORE ? process.env.DOMAIN_IGNORE.split(",") : []
    , DOMAIN_MOUNT = process.env.DOMAIN_MOUNT ? process.env.DOMAIN_MOUNT.split(",") : [];

  console.log(chalk.green("\tRoutes:"));

  let domains = Object.keys(config.routes)
    , result = {};

  if (domains.length == 1 || DOMAIN_MOUNT.length === 1 || (domains - DOMAIN_IGNORE.length) === 1) {
    let domain = DOMAIN_MOUNT[0] || domains[0]
      , routes = baxel_router(config.routes[domain]);

    result[domain] = routes;

    // Apply middleware if exists
    middleware(app, app, domain, false);

    let router = mount(app, routes, false);

    app
      .use(router.routes())
      .use(router.allowedMethods());
  } else if (!process.env.HOST) {
    console.log(chalk.red("please set environment variable HOST in .env file"));
  } else {
    for (let k in domains) {
      if (DOMAIN_IGNORE.lenght > 0 && DOMAIN_IGNORE.indexOf(domains[k]) > -1) continue;
      else if (DOMAIN_MOUNT.lenght > 0 && DOMAIN_MOUNT.indexOf(domains[k]) === -1) continue;

      let domain = domains[k]
        , routes = baxel_router(config.routes[domain])
        , subapp = koa()
        , host = (domain !== "root" ? domain + "." : "") + process.env.HOST;

      result[host] = routes;

      console.log(chalk.green("\t\t" + host));
      
      // Apply middleware if exists
      middleware(app, subapp, domain);

      let router = mount(app, routes);

      subapp
        .use(router.routes())
        .use(router.allowedMethods());

      app.use(vhost({
        host: host,
        app: subapp
      }));
    }
  }

  return result;
};