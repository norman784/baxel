"use strict";

let nodemon = require("nodemon");

module.exports = function (program) {
  nodemon({
    script: program.i ? __dirname + "/interactive" : process.cwd() + "/app.js",
    ext: "js json"
  });

  nodemon.on("start", function () {
    console.log("Baxel server started");
  }).on("quit", function () {
    console.log("Baxel has quit");
  }).on("restart", function (files) {
    console.log("Baxel restarted due to: ", files);
  });
}