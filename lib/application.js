"use strict";

let fs = require("fs")
  , chalk = require("chalk");

if (fs.existsSync(process.cwd() + "/.env")) {
  require("dotenv").load();
} else {
  console.log(chalk.red("\n-------------"));
  console.log(chalk.red("please create a .env file in the project root folder"));
  console.log(chalk.red("-------------\n"));
}

/**
 * Setup env vars
 */
process.env.CONFIG_PATH = process.cwd() + "/config/";
process.env.CONTROLLER_PATH = process.cwd() + "/controllers/";
process.env.HELPER_PATH = process.cwd() + "/helpers/";
process.env.MODEL_PATH = process.cwd() + "/models/";
process.env.SERIALIZER_PATH = process.cwd() + "/serializers/";
process.env.TASK_PATH = process.cwd() + "/tasks/";

/**
 * Module dependencies.
 */

let koa = require("koa.io")
  , pkg = require("./../package.json")
  , config = require("./config")
  , resources = require("./resources")
  , port = process.env.PORT || 80;

/**
 * Expose `Application`.
 */

exports = module.exports = Application;

/**
 * Initialize a new `Application`.
 *
 * @api public
 */

function Application() {
  if (!(this instanceof Application)) return new Application();

  this.app = koa();

  // Checks if .env is ignored for security reasons
  if (fs.existsSync(process.cwd() + "/.gitignore")) {
    let env = fs.readFileSync(process.cwd() + "/.gitignore", "utf8");
    if (env !== null && env.indexOf(".env") === -1) {
      console.log(chalk.magenta("\n-------------"));
      console.log(chalk.magenta("FOR SECURITY REASONS .env FILE MUST BE ADDED TO .gitignore"));
      console.log(chalk.magenta("AND SETUP MANUALLY IN EACH SERVER"));
      console.log(chalk.magenta("-------------\n"));
    }
  }

  if (!process.env.PORT) {
    console.log(chalk.yellow("\n-------------"));
    console.log(chalk.yellow("environment variable PORT not set using default '" + port + "'"));
    console.log(chalk.yellow("if you want to change it add PORT variable to .env file"));
    console.log(chalk.yellow("-------------\n"));
  }

  if (!process.env.ENVIRONMENT) {
    console.log(chalk.yellow("\n-------------"));
    console.log(chalk.yellow("environment variable ENVIRONMENT not set using default 'production'"));
    console.log(chalk.yellow("if you want to change it add ENVIRONMENT variable to .env file"));
    console.log(chalk.yellow("-------------\n"));
  }

  console.log(chalk.green("-------------"));
  console.log(chalk.green("Baxel " + pkg.version));
  console.log(chalk.green("-------------\n"));

  // Show default environment
  console.log(chalk.magenta("Environment: \t" + (process.env.ENVIRONMENT || 'production')));
  
  console.log(chalk.green("\nConfiguration:"));

  // Setup i18m
  if (config.server.i18n) {
    require('./i18n')(this.app);
  }

  // Setup log
  this.app.use(function *(next){
    console.log(chalk.grey("\t", "\t", this.request.method, "\t", this.request.url));
    yield next;
  });


  let models = require("./models")(true)
    , serializers = require("./serializers")(true)
    , helpers = require("./helpers")(true)
    , modules = require('./module');

  this.app.use (function *(next){
    this.helper = helpers;
    this.model = models;
    this.serializer = serializers;
    this.module = modules;

    yield next;
  });

  this.app.io.use (function *(next){
    this.helper = helpers;
    this.model = models;
    this.serializer = serializers;
    this.module = modules;

    yield next;
  });

  require("./tasks.js")();

  console.log(chalk.grey("\nwaiting to server start running (baxel.run)\n"));

  this.run = function (cb) {
    // Setup routes
    Application.routes = require("./router")(this.app, {
      helpers: helpers,
      models: models,
      serializers: serializers,
      modules: modules
    });

    console.log(chalk.green("Server running on port " + port));

    if (cb && cb.constructor === Function) {
      cb(this.app, port);
    } else {
      this.app.listen(port);
    }
  };
}

Application.initializer = function() {

};

Application.module = require('./module');
Application.model = resources.model;
Application.helper = resources.helper;
Application.serializer = resources.serializer;
