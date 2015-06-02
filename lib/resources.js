var options = require('./options')
	, fs = require('fs');

// Get controller file
exports.ctrl = function(name) {
	return require(options.controllerPath + name + 'Controller');
};

// Get helper file
exports.helper = function(name) {
	return require(options.helperPath + name);
};

// Get model file
exports.model = function(name) {
	return require(options.modelPath + name);
};

// Get path files

exports.getFiles = function(path) {
	var files = [];
	
	fs.readdirSync(path).forEach(function(file) {
		file = path + (path.substr(path.length-1) == '/' ? '' : '/') + file;
		if (fs.lstatSync(file).isFile()) files.push(file);
	});
	
	return files;
};