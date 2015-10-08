"use strict";

let fs = require("fs")
	, c = require("color-console");

if (fs.existsSync(process.cwd() + "/.env")) {
	require("dotenv").load();
} else {
	c.red("\n-------------");
	c.red("please create a .env file in the project root folder");
	c.red("-------------\n");
}

/**
 * Setup env vars
 */
process.env.CONFIG_PATH = process.cwd() + "/config/";
process.env.CONTROLLER_PATH = process.cwd() + "/controller/";
process.env.HELPER_PATH = process.cwd() + "/helpers/";
process.env.MODEL_PATH = process.cwd() + "/models/";
process.env.TASK_PATH = process.cwd() + "/tasks/";

/**
 * Module dependencies.
 */

let koa = null
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

function Application(customKoa) {
	// Setup custom koa framework or official koa framework
	if (customKoa) koa = customKoa;
	else if (!koa) koa = require("koa");

	if (!(this instanceof Application)) return new Application();

 	this.app = koa();

 	// Checks if .env is ignored for security reasons
 	if (fs.existsSync(process.cwd() + "/.gitignore")) {
	 	let env = fs.readFileSync(process.cwd() + "/.gitignore", "utf8");
		if (env !== null && env.indexOf(".env") === -1) {
			c.magenta("\n-------------");
			c.magenta("FOR SECURITY REASONS .env FILE MUST BE ADDED TO .gitignore");
			c.magenta("AND SETUP MANUALLY IN EACH SERVER");
			c.magenta("-------------\n");
		}
	}

	if (!process.env.PORT) {
		c.yellow("\n-------------");
		c.yellow("environment variable PORT not set using default '" + port + "'");
		c.yellow("if you want to change it add PORT variable to .env file");
		c.yellow("-------------\n");
	}

	if (!process.env.ENVIRONMENT) {
		c.yellow("\n-------------");
		c.yellow("environment variable ENVIRONMENT not set using default 'production'");
		c.yellow("if you want to change it add ENVIRONMENT variable to .env file");
		c.yellow("-------------\n");
	}

	c.green("-------------");
	c.green("Baxel " + pkg.version);
	c.green("-------------\n");

	// Show default environment
	c.magenta("Environment: \t" + (process.env.ENVIRONMENT || 'production'));
	
	c.green("\nConfiguration:");

	// Setup i18m
	if (config.server.i18n) {
		require('./i18n')(this.app);
	}

	// Check Session
	if (config.server.session && fs.existsSync(process.cwd() + "/node_modules/koa-generic-session")) {
		let session = require(process.cwd() + "/node_modules/koa-generic-session");

		this.app.keys = config.server.session.keys;
    this.app.use(session(config.server.session.options || {}));
    c.green("\tSession:\tOn");
  } else {
  	c.yellow("\tSession:\tOff");
  }

	// Setup log
	this.app.use(function *(next){
		c.grey("\t" + this.request.method + "\t" +this.request.url);
		yield next;
	});

	// Load Models
	let models = require("./models")();

	// Load Models
	let helpers = require("./helpers")();

	this.app.use (function *(next){
		this.model = models;
		this.helpers = helpers;
		this.module = require('./module');

		yield next;
	});

	require("./tasks.js")();

	c.grey("\nwaiting to server start running (baxel.run)\n");

	this.run = function (cb) {
		// Setup routes
		require("./router")(this.app, koa);

		c.green("Server running on port " + port);

		if (cb !== null && cb !== undefined) {
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
