"use strict";

let resources = require("./resources")
  , path = require("path")
  , fs = require("fs")
  , c = require("color-console");

module.exports = function (root, app, domain) {
  let files = 
    resources.getFiles(process.env.CONFIG_PATH + "/middleware")
    .concat(resources.getFiles(process.env.CONFIG_PATH + "/middleware/" + domain));

  c.green("\t\t\tMiddleware:");

  if (files.length == 0) c.yellow("\t\t\t\tnone");

  for (let i in files) {
    let middleware = files[i]
      , name = path.basename(path.basename(middleware, '.json'), '.js');

    if (!fs.existsSync(process.cwd() + "/node_modules/" + name)) {
      c.red("\t\t\t\t" + name + " is missing please run 'npm install " + name + " --save'");
      continue;
    }

    c.green("\t\t\t\t" + name);
    
    let mod = require(process.cwd() + "/node_modules/" + name)
      , options = require(middleware);

    if (options.constructor === Function) {
      options(root, app, mod);
    } else {
      app.use(mod(options));
    }
  }
}