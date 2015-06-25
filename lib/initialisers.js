var path = require("path")
	, fs = require("fs")
	, console = require('color-console')
	, src = require('./resources')
	, options = require('./options');

module.exports = function () {
	var lib = [];

	// Setup initializers
	console.green('\tInitialize:');
	var files = src.getFiles(path.join(options.configPath + 'initializers/'));
	for (var i in files) {
		var key = path.basename(files[i], '.js')
		lib[key] = require(files[i])();
		console.green('\t\t ' + path.basename(files[i], '.js'));
	}

	return lib;
}
