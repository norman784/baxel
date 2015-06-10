var path = require("path")
	, fs = require("fs")
	, console = require('color-console')
	, src = require('./resources')
	, options = require('./options');
	
module.exports = function () {
	var lib = [];
	
	// Setup initialisers
	console.green('\tInitialise:');
	var files = src.getFiles(path.join(options.configPath + 'initialisers/'));
	for (var i in files) {
		var key = path.basename(files[i], '.js')
		lib[key] = require(files[i])();
		console.green('\t\t ' + path.basename(files[i], '.js'));
	}
	  
	return lib;
}