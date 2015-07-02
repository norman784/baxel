var options = require('./options')
  , src = require('./resources')
  , console = require('color-console')
  , later = require('later')
  , path = require('path');

module.exports = function() {
  var files = src.getFiles(options.taskPath);

  console.green('\tTask:');
  for (var i in files) {
    if (files[i].indexOf('.js') == -1) continue;
    var key = path.basename(files[i], '.js')
      , task = require(files[i]);

    if (task.type == 'cron') {
      later.setInterval(task.task, later.parse.cron(task.schedule));
    } else if (task.type == 'recur') {
        later.setInterval(task.task, task.schedule);
    } else {
      later.setInterval(task.task, later.parse.text(task.schedule));
    }
		console.green('\t\t ' + key + '\tschedule ' + task.schedule);
  }
}
