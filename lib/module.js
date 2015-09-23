"use strict";

module.exports = function(name) {
  let init = require(process.env.CONFIG_PATH + "/initializers/" + name);
  return require(process.cwd() + "/node_modules/" + name)(init);
};