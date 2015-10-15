"use strict";

let path = require("path")
	, c = require("color-console")
	, src = require("./resources");

module.exports = function(log) {
	let modules = {};

	// Setup models
	if (log) c.green("\tModel:");
	let files = src.getFiles(path.join(process.env.MODEL_PATH));
	for (var i in files) {
		if (files[i].indexOf(".js") === -1) continue;
		let key = path.basename(files[i], ".js")
			, value = require(files[i]);
		
		modules[key] = "function" === typeof value ? value() : value;
		if (log) c.green("\t\t " + key);
	}

	return modules;
};