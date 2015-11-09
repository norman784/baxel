"use strict";

let path = require("path")
	, chalk = require("chalk")
	, src = require("./resources");

module.exports = function(log) {
	let modules = {};

	// Setup models
	if (log) console.log(chalk.green("\tModel:"));
	let files = src.getFiles(path.join(process.env.MODEL_PATH));
	for (let i in files) {
		if (files[i].indexOf(".js") === -1) continue;
		let key = path.basename(files[i], ".js")
			, value = require(files[i]);
		
		modules[key] = "function" === typeof value ? value() : value;
		if (log) console.log(chalk.green("\t\t " + key));
	}

	return modules;
};