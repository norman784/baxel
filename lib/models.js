'use strict';

var path = require("path")
	, fs = require("fs")
	, console = require('color-console')
	, src = require('./resources')
	, options = require('./options');

module.exports = function() {
	var models = {};

	// Setup initializers
	console.green('\tModel:');
	var files = src.getFiles(path.join(options.modelPath));
	for (var i in files) {
		if (files[i].indexOf('.js') == -1) continue
		var key = path.basename(files[i], '.js')
		models[key] = require(files[i])();
		console.green('\t\t ' + key);
	}

	return models;
}
