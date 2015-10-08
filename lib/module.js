"use strict";

let fs = require('fs')
  , c = require('color-console');

module.exports = function(name) {
  let file = [
    process.env.CONFIG_PATH + "initializers/" + name,
    process.cwd() + "/node_modules/" + name,
  ];

  if (!fs.existsSync(file[0] + ".js") || fs.existsSync(file[0] + ".json")) c.red("\tInitializer " + name + " [js/json] not found, add it on /config/initializers");
  else if (!fs.existsSync(file[1])) c.red("\tModule " + name + " not found, install it running 'npm install --save "+ name +"'");
  else {
    let init = require(file[0]);
    return require(file[1])("function" === typeof init ? init() : init);
  }
};