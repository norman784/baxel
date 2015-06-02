var options = require('./options');

// Get config file
exports.config = function(name) {
	return require(options.configPath + name);
};

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