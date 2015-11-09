"use strict";

let path = require("path")
  , chalk = require("chalk")
  , src = require("./resources");

module.exports = function(log) {
  let modules = {};

  // Setup helpers
  if (log) console.log(chalk.green("\tHelper:"));
  let files = src.getFiles(path.join(process.env.HELPER_PATH));
  for (var i in files) {
    if (files[i].indexOf(".js") === -1) continue;
    let key = path.basename(files[i], ".js");
    modules[key] = require(files[i]);
    if (log) console.log(chalk.green("\t\t " + key));
  }

  return modules;
};