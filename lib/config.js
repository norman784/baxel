"use strict";

let fs = require("fs")
	, exclude = ["locales", "initializers"]
  , options = {}
	, files = []
	, setup = function (directory) {
		fs.readdirSync(directory).forEach(function(f) {
			let file = directory + f;
			if (fs.lstatSync(file).isFile() && (file.indexOf(".js") > -1 || file.indexOf(".json") > -1)) files.push(file);
			else if (fs.lstatSync(file).isDirectory() && exclude.indexOf(f) === -1) setup(file + "/");
		});
	};

setup(process.env.CONFIG_PATH);

for (let i in files) {
	let key = files[i].replace('.json', '').replace('.js', '').replace(process.env.CONFIG_PATH, '')
		, file = require(files[i])
		, cnf = null;

	if ("function" === typeof file) cnf = file();
	else cnf = file;

	if (key.indexOf('/') > -1) {
		let keys = key.split('/');

		options[keys[0]] = {};
		options[keys[0]][keys[1]] = cnf;
	} else {
		options[key] = cnf;
	}
}

module.exports = options;