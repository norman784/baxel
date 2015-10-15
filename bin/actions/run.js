"use strict";

let nodemon = require("nodemon");

module.exports = function (program) {
  nodemon({
    script: __dirname + "/interactive",
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