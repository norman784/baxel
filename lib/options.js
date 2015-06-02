var options = {
		configPath: process.cwd() + '/config/',
		controllerPath: process.cwd() + '/controller/',
		helperPath: process.cwd() + '/helpers/',
		modelPath: process.cwd() + '/models/',
		viewPath: process.cwd() + '/views/',
		server: {},
		view: {}
	};

options.server = require(options.configPath + 'server');
options.view = require(options.configPath + 'view');

module.exports = options;