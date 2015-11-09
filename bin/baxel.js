#!/usr/bin/env node
"use strict";

let fs = require("fs")
  , program = require("commander");

// Baxel options

let options = {};

// options

program
  .version(require("../package.json").version)
  .usage("[options]")
  .option("run", "run Baxel project on the current directory")
  .option("i", "enable interactive mode")
  .option("new [name]", "creates a new project on the folder with the same project name");

program.on("--help", function(){
  console.log("  Usage:");
  console.log("");
  console.log("    # create a new project");
  console.log("    $ baxel new blog");
  console.log("");
  console.log("    # baxel run");
  console.log("    $ run the current baxel project");
  console.log("");
});

program.parse(process.argv);

// options given, parse them

if (program.obj) {
  options = parseObj(program.obj);
}

/**
 * Parse object either in `input` or in the file called `input`. The latter is
 * searched first.
 */
function parseObj () {
  let str;
  try {
    str = fs.readFileSync(program.obj);
  } catch (e) {
    return eval("(" + program.obj + ")");
  }
  // We don"t want to catch exceptions thrown in JSON.parse() so have to
  // use this two-step approach.
  return JSON.parse(str);
}

// actions

if (program.new) {
  require('./actions/new')(program);
} else {
  require('./actions/run')(program);
}
