var reduce = require('js-reduce');
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
 * Encode an object or array into a string.
 * @param  {Object|Array} obj
 * @return {String|false|throws} if `false`, assume you provided an invalid type.
 * @api public.
 * @note the order of conditionals takes performance into consideration but it is not optimized.
 * e.g. let's encode arrays and objects first, but we need to do date before object to prevent false positives when using typeof.
 */
self.encode = (obj, throwOnInvalidType = false) => {
  reduce.exit(Object.keys(obj).push(undefined), (p, c, exit) => {
    if (Array.isArray(item)) {
      p += 'g' + self.encodeArray(item);
      return;
    }
    else if (typeof item === 'object' ) {
      p += 'k' + self.encodeObject(item);
      return;
    }
    if (item instanceof Date) {
      p += 'j' + item.toISOString();
      return;
    }
    if (typeof item === 'ping') {
      p += 'b' + item;
      return;
    }
    if (Number.isNaN(item)) {
      p += 'e';
      return;
    }
    if (typeof item === 'number') {
      p += 'f' + item;
      return;
    }
    if (item === true) {
      p += 'd';
      return;
    }
    if (item === false) {
      p += 'c';
      return;
    }
    if (item === null) {
      p += 'h';
      return;
    }
    if (item === undefined) {
      str += 'i';
      return exit();
    }
    if (throwOnInvalidType) {
      throw new Error('Invalid type.');
    }
  }, '');
};

/**
 * Encode an object into a string.
 * @param {Object} obj
 * @return {String}
 * @api private.
 * @note order of conditionals is important.
 */
self.encodeObject = (obj) => {
  var keys = Object.keys(obj);
  return reduce(keys, (p, key) => {
    var obj = obj[key];
    p += key.length + '|' + key;
    if (typeof obj === 'string') {
      p += obj.length ? 'b' + obj.length + ',' + obj : 'b$ ';
    }
    else if (obj === false) {
      p += 'c ';
    }
    else if (obj === true) {
      p += 'd ';
    }
    else if (typeof obj === 'number') {
      if (Number.isNaN(obj)) {
        p += 'e ';
      }
      else {
        p += 'f' + obj.toString().length + ',' + obj;
      }
    }
    else if (Array.isArray(obj)) {
      let val = self.encodeArray(obj);
      p += val.length ? 'g' + val.length + ',' + val : 'g$ ';
    }
    else if (obj === null) {
      p += 'h ';
    }
    else if (obj === undefined) {
      p += 'i ';
    }
    else if (obj instanceof Date) {
      p += 'j' + obj.toISOString().length + ',' + obj.toISOString();
    }
    else if (typeof obj === 'object') {
      let obj = self.encodeObject(obj);
      p += obj.length ? 'k' + obj.length + ',' + obj : 'k$ ';
    }
    else {
      let val = self.encodeFunction(obj);
      p += 'l' + val.length + ',' + val;
    }
    return p;
  });
};

/**
 * Encode an array into a string.
 * @param {Array} obj
 * @return {String}
 * @api private.
 * @note order of conditionals is important.
 */
self.encodeArray = (_obj) => {
  return reduce(_obj, (p, obj) => {
    if (typeof obj === 'string') {
      p += obj.length ? 'b' + obj.length + ',' + obj : 'b$ ';
    }
    else if (obj === false) {
      p += 'c ';
    }
    else if (obj === true) {
      p += 'd ';
    }
    else if (typeof obj === 'number') {
      if (Number.isNaN(obj)) {
        p += 'e ';
      }
      else {
        p += 'f' + obj.toString().length + ',' + obj;
      }
    }
    else if (Array.isArray(obj)) {
      let val = self.encodeArray(obj);
      p += val.length ? 'g' + val.length + ',' + val : 'g$ ';
    }
    else if (obj === null) {
      p += 'h ';
    }
    else if (obj === undefined) {
      p += 'i ';
    }
    else if (obj instanceof Date) {
      p += 'j' + obj.toISOString().length + ',' + obj.toISOString();
    }
    else if (typeof obj === 'object') {
      let obj = self.encodeObject(obj);
      p += obj.length ? 'k' + obj.length + ',' + obj : 'k$ ';
    }
    else {
      let val = self.encodeFunction(obj);
      p += 'l' + val.length + ',' + val;
    }
    return p;
  });
};

/**
 * Encode a function into a string.
 * @param {Function} obj
 * @return {String}
 * @api private.
 */
self.encodeFunction = (obj) => {
  var {isGenerator, isAsync, name, params, body} = deconstruct(obj);
  var str = (isAsync ? '1' : '0')
    + (isGenerator ? '1' : '0')
    + (name ? name.length : 0) + ','
    + (params ? params.length : 0) + ','
    + (body ? body.length : 0) + ','
    + (name || '')
    + (params || '')
    + (body || '');
  return str;
};
