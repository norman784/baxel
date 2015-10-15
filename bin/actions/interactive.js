"use strict";

require(process.cwd() + "/app.js");
let vorpal = require("vorpal")()
  , c = require("color-console")
  , baxel = require("../../../baxel")
  , models = require("../../../baxel/lib/models")()
  , helpers = require("../../../baxel/lib/helpers")()
  , co = require("co")
  , fs = require("fs");

vorpal
  .command("paths [ctrl]", "Show paths")
  .option("-d, --domain <domain>", "Shows only domain paths")
  .option("-c, --controller <ctrl>", "Shows only controller paths")
  .action(function(args, callback){
    if (args && args.options && args.options.controller) {
      let count = 0;

      c.green(args.options.controller);
      for (let host in baxel.routes) {
        for (var i in baxel.routes[host]) {
          if (baxel.routes[host][i].indexOf("/" + args.options.controller + "#") == -1) continue;
          c.green("\t" + baxel.routes[host][i]);
          ++count;
        }
      }

      if (count == 0) c.red("\tTheres no routes for the controller");
    } else if (args && args.options && args.options.domain) {
      let count = 0;

      c.green(args.options.domain);

      if (!baxel.routes[domain]) {
        for (var i in baxel.routes[domain]) {
          if (baxel.routes[host][i].indexOf("/" + args.options.controller + "#") == -1) continue;
          c.green("\t" + baxel.routes[domain][i]);
          ++count;
        }
      }

      if (count == 0) c.red("\tTheres no routes for the domain");
    } else {
      for (let host in baxel.routes) {
        c.green(host);
        for (var i in baxel.routes[host]) {
          c.green("\t" + baxel.routes[host][i]);
        }
      }
    }
    callback();
  });

vorpal
  .command("env <env> [value]", "Get / Set environment variable")
  .action(function(args, callback){
    let env = args.env
      , value = args.value;

    if (value) {
      process.env[env] = value;
    }

    c.green("\t" + env + ": " + process.env[env]);

    callback();
  });

vorpal
  .command("task <task>", "Execute certain task")
  .action(function(args, callback){
    let task = process.cwd() + "/tasks/" + args.task + ".js";
    
    if (fs.existsSync(task)) {
      c.green("\tTask " + args.task + "executed");
      co(require(task).task);
    } else {
      c.red("\tTask " + args.task + " doesn't exists");
    }

    callback();
  });

vorpal
  .mode("model")
  .description("Enable model execution")
  .delimiter("model:")
  .init(function(args, callback){
    this.log("Welcome to Model mode.\nYou can now call a model, don't use the 'yield' keyword");
    callback();
  })
  .action(function(command, callback){
    let self = this;

    co(function *(next){
      for (let model in models) {
        global[model] = models[model];
      }

      let result = yield eval(command);

      if (result && result.constructor == Array) {
        for (let i in result) {
          result[i] = result[i].toJSON();
        }
      } else {
        result = result.toJSON();
      }

      if (typeof result != 'string') {
           result = JSON.stringify(result, undefined, 2);
      }

      c.green(result);
      self.log("");

      for (let model in models) {
        delete global[model];
      }

      yield next;
    });

    callback();
  });

vorpal 
  .mode("helper")
  .description("Enable helper execution (helper with generators not suported yet!)")
  .delimiter("helper:")
  .init(function(args, callback){
    this.log("Welcome to Helper mode.\nYou can now call a helper, generators helpers not supported yet!");
    callback();
  })
  .action(function(command, callback){

    for (let helper in helpers) {
      global[helper] = helpers[helper];
    }

    this.log(eval(command));

    for (let helper in helpers) {
      delete global[helper];
    }
    callback();
  });

vorpal
  .delimiter("baxel$")
  .show();