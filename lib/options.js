var path = require('path')
  , fs = require('fs')
  , options = {
		configPath: process.cwd() + '/config/',
		controllerPath: process.cwd() + '/controller/',
		helperPath: process.cwd() + '/helpers/',
		modelPath: process.cwd() + '/models/',
		viewPath: process.cwd() + '/views/',
		server: {},
		view: {}
	},
	files = [];
	
fs.readdirSync(options.configPath).forEach(function(file) {
	file = options.configPath + (options.configPath.substr(options.configPath.length-1) == '/' ? '' : '/') + file;
	if (fs.lstatSync(file).isFile()) files.push(file);
});

for (var i in files) {
	var key = path.basename(files[i], '.js');
	
	options[key] = require(files[i]);
	
	console.log(key, options[key]);
}

module.exports = options;