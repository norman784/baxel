'use strict';

/**
 * Module dependencies.
 */

var koa = require('koa')
	, serve = require('koa-static')
	, console = require('color-console')
	, pkg = require('./../package.json')
	, options = require('./options')
	, views = require('koa-views')
	, resources = require('./resources')
	, bodyParser = require('koa-body');

/**
 * Application prototype.
 */

var app = Application.prototype;

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
 	if (!(this instanceof Application)) return new Application;

	this.app = koa();

	console.green('-------------');
	console.green('Baxel ' + pkg.version);
	console.green('-------------\n');
	console.green('Configuration');

	var environments = ['production', 'development'];

	// Set default environment
	if (environments.indexOf(process.env.environment) < 0) {
		process.env.environment = environments[0];
	}

	if (process.env.environment == environments[1]) {
		console.magenta('\tEnvironment: \t' + process.env.environment);
	} else {
		console.green('\tEnvironment: \t' + process.env.environment);
	}

	// If publicPath is null we don't serve static files
	if (options.server.publicPath != null) {
		console.green('\tStatic files:\t' + options.server.publicPath);
		this.app.use(serve(options.server.publicPath));
	} else {
		console.yellow('\tStatic files:\tOff');
	}

	// Setup initializers
	Application.Initializer = require('./initializers')();

	// Setup view
	console.green('\tSetup view engine');
	this.app.use(views(options.viewPath, options.view));

	// Setup Body Parser
	this.app.use(bodyParser(options.server.upload));

	// Setup log
	this.app.use(function *(next){
		console.grey('\t' + this.request.method + '\t' +this.request.url);
		yield next;
	});

	// Load Models
	var models = require('./models')();

	this.app.use (function *(next){
		this.Model = models;

		yield next;
	});

	require('./tasks.js')();

	console.grey('\nwaiting to server start running (baxel.run)\n');

	this.run = function () {
		// Setup routes
		var router = require('./routing/router')();

		this.app
		  .use(router.routes())
		  .use(router.allowedMethods());

		console.green('Server running on port ' + options.server.port);
		this.app.listen(options.server.port);
	};
}

Application.model = resources.model;
Application.ctrl = resources.ctrl;
Application.helper = resources.helper;
