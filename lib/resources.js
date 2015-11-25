"use strict";

let fs = require("fs");

// Get controller file
exports.ctrl = function(name) {
  return require(process.env.CONTROLLER_PATH + name + "Controller");
};

// Get helper file
exports.helper = function(name) {
  return require(process.env.HELPER_PATH + name);
};

// Get model file
exports.model = function(name) {
  return require(process.env.MODEL_PATH + name);
};

// Get model file
exports.serializer = function(name) {
  return require(process.env.SERIALIZER_PATH + name + "Serializer");
};

// Get path files

let getFiles = exports.getFiles = function(path, recursive) {
  let files = [];

  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file) {
      file = path + (path.substr(path.length-1) ==="/" ? "" : "/") + file;
      if (recursive === true && fs.lstatSync(file).isDirectory()) files = files.concat(getFiles(file));
      if (fs.lstatSync(file).isFile() && (file.indexOf(".js") > -1 || file.indexOf(".json") > -1)) files.push(file);
    });
  }

  return files;
};