"use strict";

let fs = require('fs')
  , chalk = require('chalk')
  , config = require('./config');

module.exports = function(app) {
  let i18n = null
    , locale = null
    , file = [process.cwd() + '/node_modules/koa-i18n', process.cwd() + '/node_modules/koa-locale'];

  if (fs.existsSync(file[0])) i18n = require(file[0]);
  if (fs.existsSync(file[1])) locale = require(file[1]);

  if (i18n === null || locale === null || !config.server.i18n) {
    console.log(chalk.yellow("\ti18n:\t\tOff\t\tTo enable it run 'npm install --save koa-i18n koa-locale'"));
    return;
  }

  let path = "/config/locales";

  locale(app);

  config.server.i18n.directory = process.cwd() + path;
  app.use(i18n(app, config.server.i18n));

  console.log(chalk.green("\ti18n:\t\t" + path));
};