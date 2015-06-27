'use strict';

var router = require('koa-router')()
	, path = require("path")
	, fs = require("fs")
	, _ = require('underscore')
	, console = require('color-console')
	, src = require('./resources')
	, options = require('./options');

module.exports = function () {
	// Setup routes
	console.green('\tRoutes:');
	var routes = src.getFiles(path.join(options.configPath + 'routes/'));
	for (var i in routes) {
		var route = require(routes[i]);
		// If not is array continue with next
		if (!_.isArray(route)) {
			console.red('\t\t- Cannot load resources from route file: ' + options.configPath + '/routes/' + file);
			return;
		}

		for (var i in route) {
			try {
				var action = route[i].ctrl.split('#')
				  , controller = src.ctrl(action[0])[action[1]];
			} catch (e) {
				console.red('\t\t' + route[i].method + '\t' + route[i].url + '\t Failed to load controller "' + action[0] + '"');
				continue;
			}

			if (controller == undefined) {
				console.red('\t\t' + route[i].method + '\t' + route[i].url + '\t Failed to load controller "' + action[0] + '" function "' + action[1] + '"');
				continue;
			}

			console.green('\t\t' + route[i].method + '\t' + route[i].url + '\t' + route[i].ctrl);

			if (route[i].method == 'POST') {
			  router.post(route[i].url, controller);
			} else if (route[i].method == 'PUT') {
			  router.put(route[i].url, controller);
			} else if (route[i].method == 'PATCH') {
			  router.patch(route[i].url, controller);
			} else if (route[i].method == 'DELETE') {
			  router.del(route[i].url, controller);
			} else {
			  router.get(route[i].url, controller);
			}
		}
	}

	return router;
}
