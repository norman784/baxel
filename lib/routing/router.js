'use strict';

var router = require('koa-router')
	, vhost = require('koa-vhost')
	, path = require("path")
	, fs = require("fs")
	, _ = require('underscore')
	, log = require('color-console')
	, src = require('../resources')
	, opt = require('../options')
	, route = require('./route')
	, resources = function(options, router) {
		exclude = options.exclude || [];
		// List
		if (exclude.indexOf('index') == -1) setRoute(options.url, options.ctrl + '#index', 'GET', router);

		// Details
		if (exclude.indexOf('get') == -1) setRoute(options.url + '/:id', options.ctrl + '#get', 'GET', router);

		// New
		if (exclude.indexOf('new') == -1 && exclude.indexOf('form') == -1) setRoute(options.url + '/new', options.ctrl + '#form', 'GET', router);

		// Edit
		if (exclude.indexOf('edit') == -1 && exclude.indexOf('form') == -1) setRoute(options.url + '/:id/edit', options.ctrl + '#form', 'GET', router);

		// Save
		if (exclude.indexOf('save') == -1) {
			setRoute(options.url, options.ctrl + '#save', 'POST', router);
			setRoute(options.url + '/:id', options.ctrl + '#save', 'PUT', router);
		}

		// Delete
		if (exclude.indexOf('delete') == -1) setRoute(options.url + '/:id', options.ctrl + '#del', 'DELETE', router);
	}
	, getController = function (options) {
		var action = options.ctrl.split('#');

		var controller = src.ctrl(action[0])[action[1]];

		if (controller != undefined) {
			route(options);
			return controller;
		}

		log.red('\t\t' + (options.host ? options.host + '\t\t' : '') + options.method + '\t' + options.url + '\t Failed to load controller "' + action[0] + '" function "' + action[1] + '"');

		return false;
	}
	, setRoute = function (options, router) {
		var controller = getController (options);

		if (controller == false) return;

		log.green('\t\t' + (options.host ? options.host + '\t\t' : '') +  options.method + '\t' + options.url + '\t' + options.ctrl);

		switch (options.method) {
			case 'POST': 		router.post(options.url, controller); 	break;
			case 'PUT': 		router.put(options.url, controller); 		break;
			case 'PATCH': 	router.patch(options.url, controller); 	break;
			case 'DELETE': 	router.del(options.url, controller); 		break;
			default: 				router.get(options.url, controller); 		break;
		}
	};

module.exports = function (app, koa) {
	// Setup routes
	log.green('\tRoutes:');
	var routes = src.getFiles(path.join(opt.configPath + 'routes/'))
		, hosts = {};

	for (var i in routes) {
		var options = require(routes[i]);

		// If not is array continue with next
		if (!_.isArray(options)) {
			log.red('\t\t- Cannot load resources from route file: ' + opt.configPath + '/routes/' + file);
			return;
		}

		for (var i in options) {
			var host = options[i].host || '*';

			if (!hosts[host]) hosts[host] = router();

			if (options[i].method == 'RESOURCES') {
				resources (options[i], hosts[host]);
			} else {
				setRoute(options[i], hosts[host]);
			}
		}
	}

	if (Object.keys(hosts).length > 1) {
		for (var i in hosts) {
			var server = koa();
			server
				.use(hosts[i].routes())
				.use(hosts[i].allowedMethods());
			app.use(vhost({
				host: i,
				app: server
			}));
		}
	} else if (Object.keys(hosts).length == 1) {
		var host = Object.keys(hosts);
		app
			.use(hosts[host[0]].routes())
			.use(hosts[host[0]].allowedMethods());
	}
}
