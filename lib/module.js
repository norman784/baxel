"use strict";

let fs = require('fs')
  , c = require('color-console');

module.exports = function(name) {
  let file = process.env.CONFIG_PATH + "initializers/" + name;
  if (!fs.existsSync(file + ".js")) c.red("\tInitializer " + name + ".js not found, add it on /config/initializers");
  return require(file);
};