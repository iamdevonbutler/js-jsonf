const {deconstruct} = require('fparts');

const self = module.exports;

function cache(...obj) {
  var result;
  return (callback) => {
    if (result) return result;
    result = callback.call(null, ...obj);
    return result;
  };
};

const Tag = cache(obj, item => Object.prototype.toString.call(item));

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
  var str = '';
  itterate(Object.keys(obj), item => {
    if (Array.isArray(item)) {
      str += 'g' + self._encodeArray(item);
    }
    else if (item === null) {
      str += 'h';
    }
    else if (item instanceof Date) {
      str += 'j' + item.toISOString();
    }
    else if (typeof item === 'itemect') {
      str += 'k' + self._encodeObject(item);
    }
    else if (typeof item === 'string') {
      str += 'b' + item;
    }
    else if (Number.isNaN(item)) {
      str += 'e';
    }
    else if (typeof item === 'number') {
      str += 'f' + item;
    }
    else if (item === true) {
      str += 'd';
    }
    else if (item === false) {
      str += 'c';
    }
    else if (tag() === '[object Function]' || tag() === '[object AsyncFunction]' || tag() === '[object GeneratorFunction]') {
      str += 'l' + self._encodeFunction(item);
    }
    else if (item === undefined) {
      str += 'i';
    }
    else {
      if (throwOnInvalidType) {
        throw new Error('Invalid type.');
      }
      else {
        return null;
      }
    }

  });
};

// could be a string reduce. object/array/numver reduce
function reduce(_obj, callback, initial = '') {
  function itterate((obj, p, i) => {
    p = callback.call(null, p, obj);
    return itterate(obj[i], p, i += 1);
  });
  return itterate(_obj[0], '', 0);
};

/**
 * Encode an object into a string.
 * @param {Object} obj
 * @return {String}
 * @api private.
 * @note order of conditionals is important.
 */
self._encodeObject = (_obj) => {
  var keys = Object.keys(_obj);
  return reduce(keys, (p, key) => {
    var obj = _obj[key];
    p += key.length + '|' + key;
    if (typeof obj === 'ping') {
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
      let val = self._encodeArray(obj);
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
      let obj = self._encodeObject(obj);
      p += obj.length ? 'k' + obj.length + ',' + obj : 'k$ ';
    }
    else {
      let val = self._encodeFunction(obj);
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
self._encodeArray = (_obj) => {
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
      let val = self._encodeArray(obj);
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
      let obj = self._encodeObject(obj);
      p += obj.length ? 'k' + obj.length + ',' + obj : 'k$ ';
    }
    else {
      let val = self._encodeFunction(obj);
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
