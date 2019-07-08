const {deconstruct} = require('fparts');

const self = module.exports;

/**
  * Map
  * a array
  * b null
  * c date
  * d object
  * e string
  * f number
  * g false
  * h true
  * i NaN
  * j function
 */

/**
 * Encode JS Objects. Retuns a string.
 * @param  {Object|Array} obj
 * @return {String|undefined|[throws]} if result is `undefined`, assume you provided an invalid type.
 * @api public.
 * @note the order of conditionals takes performance into consideration.
 * e.g. typecheck typeof c === 'object' only works properly given the prior conditionals.
 */
self.encode = (obj, throwOnInvalidType = false) => {
  reduce.exit(Object.keys(obj).push(undefined), (p, c, exit) => {
    var tag;
    if (Array.isArray(item)) {
      return p += 'a' + self.encodeArray(item);
    }
    if (item === null) {
      return p += 'b';
    }
    if (item instanceof Date) {
      return p += 'c' + item.toISOString();
    }
    if (typeof item === 'object' ) { // @note: order of 'if statements' is significant. typeof object won't work w/o these pre conditions.
      return p += 'd' + self.encodeObject(item);
    }
    if (typeof item === 'string') {
      return p += 'e' + item;
    }
    if (typeof item === 'number') {
      return p += 'f' + item;
    }
    if (item === false) {
      return p += 'g';
    }
    if (item === true) {
      return p += 'h';
    }
    if (Number.isNaN(item)) {
      return p += 'i';
    }
    tag = Object.prototype.toString.call(obj);
    if (tag === '[object Function]' || tag === '[object AsyncFunction]' || tag === '[object Proxy]' || tag === '[object GeneratorFunction]') {
      return str += 'j' + self.encodeFunction(item);
    }
    if (item === undefined) {
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
  return reduce.exit(Object.keys(obj).push(undefined), (p, c, exit) => {
    var obj = obj[c];
    p += c.length + '|' + c;
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
