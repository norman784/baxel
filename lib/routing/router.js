'use strict';

var router = require('koa-router')()
	, path = require("path")
	, fs = require("fs")
	, _ = require('underscore')
	, console = require('color-console')
	, src = require('../resources')
	, options = require('../options')
	, route = require('./route')
	, resources = function(url, ctrl, exclude) {
		exclude = exclude || [];
		// List
		if (exclude.indexOf('index') == -1) setRoute(url, ctrl + '#index', 'GET');

		// Details
		if (exclude.indexOf('get') == -1) setRoute(url + '/:id', ctrl + '#get', 'GET');

		// New
		if (exclude.indexOf('new') == -1 && exclude.indexOf('form') == -1) setRoute(url + '/new', ctrl + '#form', 'GET');

		// Edit
		if (exclude.indexOf('edit') == -1 && exclude.indexOf('form') == -1) setRoute(url + '/:id/edit', ctrl + '#form', 'GET');

		// Save
		if (exclude.indexOf('save') == -1) {
			setRoute(url, ctrl + '#save', 'POST');
			setRoute(url + '/:id', ctrl + '#save', 'PUT');
		}

		// Delete
		if (exclude.indexOf('delete') == -1) setRoute(url + '/:id', ctrl + '#del', 'DELETE');
	}
	, getController = function (options) {
		var action = options.ctrl.split('#');

		try {
			var controller = src.ctrl(action[0])[action[1]];

			if (controller != undefined) {
				route(options);
				return controller;
			}

			console.red('\t\t' + options.method + '\t' + options.url + '\t Failed to load controller "' + action[0] + '" function "' + action[1] + '"');
		} catch (e) {
			console.red(e);
			console.red('\t\t' + options.method + '\t' + options.url + '\t Failed to load controller "' + action[0] + '"');
		}

		return false;
	}
	, setRoute = function (url, ctrl, method) {
		var controller = getController ({
			url: url,
			ctrl: ctrl,
			method: method
		});

		if (controller == false) return;

		console.green('\t\t' + method + '\t' + url + '\t' + ctrl);

		switch (method) {
			case 'POST': 		router.post(url, controller); 	break;
			case 'PUT': 		router.put(url, controller); 		break;
			case 'PATCH': 	router.patch(url, controller); 	break;
			case 'DELETE': 	router.del(url, controller); 		break;
			default: 				router.get(url, controller); 		break;
		}
	};

module.exports = function () {
	// Setup routes
	console.green('\tRoutes:');
	var routes = src.getFiles(path.join(options.configPath + 'routes/'));

	for (var i in routes) {
		var _route = require(routes[i]);
		// If not is array continue with next
		if (!_.isArray(_route)) {
			console.red('\t\t- Cannot load resources from route file: ' + options.configPath + '/routes/' + file);
			return;
		}

		for (var i in _route) {
			if (_route[i].method == 'RESOURCES') {
				resources (_route[i].url, _route[i].ctrl, _route[i].exclude);
			} else {
				setRoute(_route[i].url, _route[i].ctrl, _route[i].method);
			}
		}
	}

	return router;
}
