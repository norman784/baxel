"use strict";

let unzip = require("adm-zip")
  , templateURL = require("../../package.json")["baxel-template"]
  , request = require("request")
  , fs = require("fs")
  , path = require("path");


module.exports = function (program) {
  let data = []
    , dataLen = 0;

  request(
    {
      method: "GET",
      uri: templateURL,
      gzip: true
    }
  , function () {
      console.log("Baxel Hamet finished, now enter the project folder '" + program.new + "' and start hacking");
    }
  ).on("data", function(chunk) {
    data.push(chunk);
    dataLen += chunk.length;
  })
  .on("end", function() {
    let buf = new Buffer(dataLen);

    for (let i=0, len = data.length, pos = 0; i < len; i++) {
        data[i].copy(buf, pos);
        pos += data[i].length;
    }

    let zip = new unzip(buf)
      , dir = process.cwd() + "/tmp";
      
    zip.extractAllTo(dir, true);

    let folder = fs.readdirSync(dir).filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });

    fs.renameSync(dir + "/" + folder[0], dir + "/../" + program.new);
    fs.rmdirSync(dir);
  });
}