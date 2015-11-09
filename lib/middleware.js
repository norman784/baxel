"use strict";

let resources = require("./resources")
  , path = require("path")
  , fs = require("fs")
  , chalk = require("chalk");

module.exports = function (root, app, domain, multiple_domains) {
  let files = 
    resources.getFiles(process.env.CONFIG_PATH + "/middleware")
    .concat(resources.getFiles(process.env.CONFIG_PATH + "/middleware/" + domain));

  console.log(chalk.green(multiple_domains ? "\t\t\t" : "\t\t", "Middleware:"));

  if (files.length == 0) console.log(chalk.yellow(multiple_domains ? "\t\t\t\t" : "\t\t\t", "none"));

  for (let i in files) {
    let middleware = files[i]
      , name = path.basename(path.basename(middleware, '.json'), '.js');

    if (!fs.existsSync(process.cwd() + "/node_modules/" + name)) {
      console.log(chalk.red(multiple_domains ? "\t\t\t\t" : "\t\t\t", name, "is missing please run 'npm install ", name, " --save'"));
      continue;
    }

    console.log(chalk.green(multiple_domains ? "\t\t\t\t" : "\t\t\t", name));
    
    let mod = require(process.cwd() + "/node_modules/" + name)
      , options = require(middleware);

    if (options.constructor === Function) {
      options(root, app, mod);
    } else {
      app.use(mod(options));
    }
  }
}