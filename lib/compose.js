"use strict";

let co = require("co");

module.exports = function(middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */
  return function *(next) {
    // last called middleware #
    let index = -1
      , args = Array.prototype.slice.call(arguments).slice(1)
      , context = this;

    return dispatch(0)
    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      const fn = middleware[i] || next
      if (!fn) return Promise.resolve()
      try {
        let _args = [function next() {
          return dispatch(i + 1)
        }].concat(args);

        return co.wrap(fn).apply(context, _args);
      } catch(err) {
        return Promise.reject(err);
      }
    }
  }
}