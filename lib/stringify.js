'use strict';

const {deconstruct} = require('fparts');

const self = module.exports;

/**
  * Map
  * b string
  * c false
  * d true
  * e NaN
  * f number
  * g array
  * h null
  * i undefined
  * j date
  * k object
  * l function
 */

/**
 * Deconstruct an object or array into a string.
 * @param  {Object|Array} obj
 * @return {String}
 * @api public.
 */
self.stringify = (obj) => {
  if (Array.isArray(obj)) {
    return '[' + self._stringifyArray(obj);
  }
  else {
    return '{' + self._stringifyObject(obj);
  }
};

/**
 * Deconstruct an object into a string.
 * @param  {Object} obj
 * @return {String}
 * @api private
 * @note order of conditionals is important.
 */
self._stringifyObject = (obj) => {
  var str = '', value;
  for (let key, keys = Object.keys(obj); key = keys.shift();) {
    str += key.length + '|' + key;
    value = obj[key];
    if (typeof value === 'string') {
      str += value.length ? 'b' + value.length + ',' + value : 'b$ ';
    }
    else if (value === false) {
      str += 'c ';
    }
    else if (value === true) {
      str += 'd ';
    }
    else if (typeof value === 'number') {
      if (Number.isNaN(value)) {
        str += 'e ';
      }
      else {
        str += 'f' + value.toString().length + ',' + value;
      }
    }
    else if (Array.isArray(value)) {
      let val = self._stringifyArray(value);
      str += val.length ? 'g' + val.length + ',' + val : 'g$ ';
    }
    else if (value === null) {
      str += 'h ';
    }
    else if (value === undefined) {
      str += 'i ';
    }
    else if (value instanceof Date) {
      str += 'j' + value.toISOString().length + ',' + value.toISOString();
    }
    else if (typeof value === 'object') {
      let obj = self._stringifyObject(value);
      str += obj.length ? 'k' + obj.length + ',' + obj : 'k$ ';
    }
    else {
      let {isGenerator, isAsync, name, params, body} = deconstruct(value);
      let obj = (isAsync ? '1' : '0')
        + (isGenerator ? '1' : '0')
        + (name ? name.length : 0) + ','
        + (params ? params.length : 0) + ','
        + (body ? body.length : 0) + ','
        + (name || '')
        + (params || '')
        + (body || '');
      str += 'l' + obj.length + ',' + obj;
    }
  }
  return str;
};

/**
 * Deconstruct an array into a string.
 * @param  {Array} obj
 * @return {String}
 * @api private
 * @note order of conditionals is important.
 */
self._stringifyArray = (obj) => {
  var str = '', keys, value;
  keys = Object.keys(obj);
  keys.forEach(key => {
    value = obj[key];
    if (typeof value === 'string') {
      str += value.length ? 'b' + value.length + ',' + value : 'b$ ';
    }
    else if (value === false) {
      str += 'c ';
    }
    else if (value === true) {
      str += 'd ';
    }
    else if (typeof value === 'number') {
      if (Number.isNaN(value)) {
        str += 'e ';
      }
      else {
        str += 'f' + value.toString().length + ',' + value;
      }
    }
    else if (Array.isArray(value)) {
      let val = self._stringifyArray(value);
      str += val.length ? 'g' + val.length + ',' + val : 'g$ ';
    }
    else if (value === null) {
      str += 'h ';
    }
    else if (value === undefined) {
      str += 'i ';
    }
    else if (value instanceof Date) {
      str += 'j' + value.toISOString().length + ',' + value.toISOString();
    }
    else if (typeof value === 'object') {
      let obj = self._stringifyObject(value);
      str += obj.length ? 'k' + obj.length + ',' + obj : 'k$ ';
    }
    else {
      let {isGenerator, isAsync, name, params, body} = deconstruct(value);
      let obj = (isAsync ? '1' : '0')
        + (isGenerator ? '1' : '0')
        + (name ? name.length : 0) + ','
        + (params ? params.length : 0) + ','
        + (body ? body.length : 0) + ','
        + (name || '')
        + (params || '')
        + (body || '');
      str += 'l' + obj.length + ',' + obj;
    }
  });
  return str;
};
