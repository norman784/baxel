"use strict";

let path = require("path")
	, c = require("color-console")
	, src = require("./resources");

module.exports = function() {
	let models = {};

	// Setup initializers
	c.green("\tModel:");
	let files = src.getFiles(path.join(process.env.MODEL_PATH));
	for (var i in files) {
		if (files[i].indexOf(".js") === -1) continue;
		let key = path.basename(files[i], ".js");
		models[key] = require(files[i])();
		c.green("\t\t " + key);
	}

	return models;
};