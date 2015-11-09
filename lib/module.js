"use strict";

let fs = require("fs")
  , chalk = require("chalk");

module.exports = function(name) {
  let file = process.env.CONFIG_PATH + "initializers/" + name;
  if (!fs.existsSync(file + ".js")) console.log(chalk.red("\tInitializer", name + ".js not found, add it on /config/initializers"));
  return require(file);
};