"use strict";

let path = require("path")
  , c = require("color-console")
  , src = require("./resources");

module.exports = function() {
  let modules = {};

  // Setup helpers
  c.green("\tHelper:");
  let files = src.getFiles(path.join(process.env.HELPER_PATH));
  for (var i in files) {
    if (files[i].indexOf(".js") === -1) continue;
    let key = path.basename(files[i], ".js");
    modules[key] = require(files[i]);
    c.green("\t\t " + key);
  }

  return modules;
};