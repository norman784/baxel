"use strict";

let path = require("path")
  , c = require("color-console")
  , src = require("./resources");

module.exports = function(log) {
  let modules = {};

  // Setup models
  if (log) c.green("\tSerializers:");
  let files = src.getFiles(path.join(process.env.SERIALIZER_PATH), true);
  for (let i in files) {
    if (files[i].indexOf(".js") === -1) continue;
    let key = path.basename(files[i], ".js").replace("Serializer", "")
      , value = require(files[i]);
    
    modules[key] = value;
    if (log) c.green("\t\t " + key);
  }

  return modules;
};