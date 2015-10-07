"use strict";

let src = require("./resources")
  , co = require("co")
  , c = require("color-console")
  , later = require("later")
  , path = require("path");

module.exports = function() {
  let files = src.getFiles(process.env.TASK_PATH);

  c.green("\tTask:");
  for (let i in files) {
    if (files[i].indexOf(".js") === -1) continue;
    let key = path.basename(files[i], ".js")
      , task = require(files[i])
      , cb = function() {
        co(task.task);
      };

    if (task.type === "cron") {
      later.setInterval(cb, later.parse.cron(task.schedule));
    } else if (task.type === "recur") {
      later.setInterval(cb, task.schedule);
    } else {
      later.setInterval(cb, later.parse.text(task.schedule));
    }
		c.green("\t\t " + key + "\tschedule " + task.schedule);
  }
};