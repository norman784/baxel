#!/usr/bin/env node
"use strict";

let fs = require('fs')
  , program = require('commander')
  , path = require('path')
  , AdmZip = require('adm-zip')
  , nodemon = require('nodemon')
  , templateURL = require('../package.json')['baxel-template'];

// Baxel options

let options = {};

// options

program
  .version(require('../package.json').version)
  .usage('[options]')
  .option('run', 'run Baxel project on the current directory')
  .option('new [name]', 'creates a new project on the folder with the same project name');

program.on('--help', function(){
  console.log('  Usage:');
  console.log('');
  console.log('    # create a new project');
  console.log('    $ baxel new blog');
  console.log('');
  console.log('    # baxel run');
  console.log('    $ run the current baxel project');
  console.log('');
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
    return eval('(' + program.obj + ')');
  }
  // We don't want to catch exceptions thrown in JSON.parse() so have to
  // use this two-step approach.
  return JSON.parse(str);
}

// run

function _run () {
  nodemon({
    script: 'app.js',
    ext: 'js json'
  });

  nodemon.on('start', function () {
    console.log('Baxel server started');
  }).on('quit', function () {
    console.log('Baxel has quit');
  }).on('restart', function (files) {
    console.log('Baxel restarted due to: ', files);
  });
}

// new

function _new () {
  let request = require('request')
    , data = []
    , dataLen = 0;

  request(
    { method: 'GET'
    , uri: templateURL
    , gzip: true
    }
  , function () {
  	 	console.log('Baxel Hamet finished, now enter the project folder "' + program.new + '" and start hacking');
    }
  ).on('data', function(chunk) {
    data.push(chunk);
    dataLen += chunk.length;
  })
  .on('end', function() {
    let buf = new Buffer(dataLen);

    for (let i=0, len = data.length, pos = 0; i < len; i++) {
        data[i].copy(buf, pos);
        pos += data[i].length;
    }

    let zip = new AdmZip(buf)
      , _path = process.cwd() + '/tmp';
    zip.extractAllTo (_path, true);

    let folder = fs.readdirSync(_path).filter(function(file) {
      return fs.statSync(path.join(_path, file)).isDirectory();
    });

    fs.renameSync(_path + '/' + folder[0], _path + '/../' + program.new);
    fs.rmdirSync(_path);
  });
}

// actions

if (program.new) {
  _new();
} else {
  _run();
}
