'use strict';

var pluralize = require('pluralize')
  , getUrlParams = function(url) {
    var tmp = url.split('/')
      , params = [];

    for (var i in tmp) {
      if (tmp[i].indexOf(':') == -1) continue;
      params.push(tmp[i]);
    }

    return params;
  }
  , getUrlPathName = function(url, method) {
    var path = '';

    if (url.indexOf(':id') > -1 || url.indexOf('/new') > -1) {
      url = url.replace(url.split('/')[1], pluralize.singular(url.split('/')[1], 1));
    }

    if (url.indexOf('/edit') > -1) {
      url = url.replace('/edit', '');
      path = 'edit';
    } else if (url.indexOf('/new') > -1) {
      url = url.replace('/new', '');
      path = 'new';
    } else if (method == 'DELETE') {
      path = 'delete';
    }

    url = url.split('/');

    for (var i in url) {
      if (url[i].length == 0 || url[i].indexOf(':') > -1) continue;
      path += (path.length > 0 ? '_' : '') + url[i];
    }

    return path + '_path';
  }
  , addPathToGlobal = function(path, url, params) {
    global[path] = function () {
      for (var i in params) {
        if (arguments[i] == undefined) {
          throw Error('Param [' + params[i].replace(':', '') + '] missing for [' + path + ']');
        } else {
          url = url.replace(params[i], arguments[i]);
        }
      }

      return url;
    }
  }
  , generatePath = function(url, method) {
    var path = getUrlPathName(url, method)
      , params = getUrlParams(url);

    addPathToGlobal(path, url, params);

    return path;
  }

module.exports = function(route) {
  route.path = generatePath(route.url, route.method);
  return route;
}
