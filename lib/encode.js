const {deconstruct} = require('fparts');

const self = module.exports;

const Tag = (obj) => {
  var result;
  return () => {
    if (result) return result;
    result = Object.prototype.toString.call(obj);
    return result;
  };
};

// const loop = (itterations, callback) => {
//   var i = 0;
//   function loop(i) {
//     if (itterations--) {
//       callback.call(null, i);
//     }
//     else {
//       loop(itterations);
//     }
//     i += 1;
//   };
//   loop(itterations);
// };

const itterate = (obj, callback) => {
  var exit, i = 0;
  function exit() {
    exit = true;
  }
  function itterate() {
    if (exit) {
      exit = false;
      return;
    }
    callback.call(null, i, obj[i], exit);
    i += 1;
    if (obj[i+1] !== undefined) itterate();
  };
  itterate();
};

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
  var str = '', keys = Object.keys(obj);
  itterate(keys, item => {
    const tag = Tag(obj);
    if (Array.isArray(obj)) {
      str += 'g' + self._encodeArray(obj);
    }
    else if (obj === null) {
      str += 'h';
    }
    else if (obj instanceof Date) {
      str += 'j' + obj.toISOString();
    }
    else if (typeof obj === 'object') {
      str += 'k' + self._encodeObject(obj);
    }
    else if (typeof obj === 'string') {
      str += 'b' + obj;
    }
    else if (Number.isNaN(obj)) {
      str += 'e';
    }
    else if (typeof obj === 'number') {
      str += 'f' + obj;
    }
    else if (obj === true) {
      str += 'd';
    }
    else if (obj === false) {
      str += 'c';
    }
    else if (tag() === '[object Function]' || tag() === '[object AsyncFunction]' || tag() === '[object GeneratorFunction]') {
      str += 'l' + self._encodeFunction(obj);
    }
    else if (obj === undefined) {
      str += 'i';
    }

    if (throwOnInvalidType) {
      throw new Error('Invalid type.');
    }
    else {
      return null;
    }
  });
};

/**
 * Encode an object into a string.
 * @param {Object} obj
 * @return {String}
 * @api private.
 * @note order of conditionals is important.
 */
self._encodeObject = (obj) => {
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
      let val = self._encodeArray(value);
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
      let obj = self._encodeObject(value);
      str += obj.length ? 'k' + obj.length + ',' + obj : 'k$ ';
    }
    else {
      let val = self._encodeFunction(value);
      str += 'l' + val.length + ',' + val;
    }
  }
  return str;
};

/**
 * Encode an array into a string.
 * @param {Array} obj
 * @return {String}
 * @api private.
 * @note order of conditionals is important.
 */
self._encodeArray = (obj) => {
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
      let val = self._encodeArray(value);
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
      let obj = self._encodeObject(value);
      str += obj.length ? 'k' + obj.length + ',' + obj : 'k$ ';
    }
    else {
      let val = self._encodeFunction(value);
      str += 'l' + val.length + ',' + val;
    }
  });
  return str;
};

/**
 * Encode a function into a string.
 * @param {Function} obj
 * @return {String}
 * @api private.
 */
self._encodeFunction = (obj) => {
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
