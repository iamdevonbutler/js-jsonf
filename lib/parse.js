'use strict';

const {reconstruct} = require('fparts');

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
 * Reconstruct a string (product of .stringify()) back into a Object or Array.
 * @param  {String} str
 * @return {Object|Array}
 * @api public
 * @note '&' prefix denotes array as root data structure. $ at pos 0 is object.
 */
self.parse = (str) => {
  // If array.
  if (str[0] === '[') {
    return self._parseArray(str.slice(1));
  }
  // If object.
  else {
    return self._parseObject(str.slice(1));
  }
};

/**
 * Reconstruct a string (product of .stringify()) back into a Object.
 * @param  {String} str
 * @return {Object}
 * @api private
 */
self._parseObject = (str) => {
  var obj = {}, len = str.length, i = len, ii, keyLen, keyLenTmp = '', fieldKey, fieldType, fieldLen, fieldLenTmp = '';

  while (i--) {
    ii = len - i - 1;
    if (!keyLen) {
      if (str[ii] === '|') {
        keyLen = +keyLenTmp;
        keyLenTmp = '';
      }
      else {
        keyLenTmp += str[ii];
      }
    }
    else if (fieldKey === undefined) {
      fieldKey = str.slice(ii, ii + keyLen);
      i -= keyLen - 1;
    }
    else if (fieldType === undefined) {
      fieldType = str[ii];
    }
    else if (fieldLen === undefined && 'cdehi'.indexOf(fieldType) === -1) {
      if (str[ii] === ',') {
        fieldLen = +fieldLenTmp;
        fieldLenTmp = '';
      }
      else if (str[ii] === '$') { // $ identifies empty value.
        fieldLen = 0;
      }
      else {
        fieldLenTmp += str[ii];
      }
    }
    else {
      switch (fieldType) {
        case 'b':
          obj[fieldKey] = fieldLen > 0 ? str.slice(ii, ii + fieldLen) : '';
          if (fieldLen > 0) i -= fieldLen - 1;
          break;
        case 'c':
          obj[fieldKey] = false;
          break;
        case 'd':
          obj[fieldKey] = true;
          break;
        case 'e':
          obj[fieldKey] = NaN;
          break;
        case 'f':
          obj[fieldKey] = +str.slice(ii, ii + fieldLen);
          i -= fieldLen - 1;
          break;
        case 'g':
          if (fieldLen) {
            obj[fieldKey] = self._parseArray(str.slice(ii, ii + fieldLen));
            i -= fieldLen - 1;
          }
          else {
            obj[fieldKey] = [];
          }
          break;
        case 'h':
          obj[fieldKey] = null;
          break;
        case 'i':
          obj[fieldKey] = undefined;
          break;
        case 'j':
          obj[fieldKey] = new Date(str.slice(ii, ii + fieldLen));
          i -= fieldLen - 1;
          break;
        case 'k':
          if (fieldLen) {
            obj[fieldKey] = self._parseObject(str.slice(ii, ii + fieldLen));
            i -= fieldLen - 1;
          }
          else {
            obj[fieldKey] = {};
          }
          break;
        case 'l':
          obj[fieldKey] = self._parseFunction(str.slice(ii, ii + fieldLen));
          i -= fieldLen - 1;
          break;
        default:
          throw new Error('Invalid entry: ' + fieldType);
      }
      keyLen = undefined;
      fieldKey = undefined;
      fieldType = undefined;
      fieldLen = undefined;
    }
  }
  return obj;
};

/**
 * Reconstruct a string (product of .stringify()) back into a Array.
 * @param  {String} str
 * @return {Array}
 * @api private
 */
self._parseArray = (str) => {
  var obj = [], len = str.length, i = len, ii, fieldType, fieldLen, fieldLenTmp = '';
  while (i--) {
    ii = len - i - 1;
    if (fieldType === undefined) {
      fieldType = str[ii];
    }
    else if (fieldLen === undefined && 'cdehi'.indexOf(fieldType) === -1) {
      if (str[ii] === ',') {
        fieldLen = +fieldLenTmp;
        fieldLenTmp = '';
      }
      else if (str[ii] === '$') { // $ identifies empty value.
        fieldLen = 0;
      }
      else {
        fieldLenTmp += str[ii];
      }
    }
    else {
      switch (fieldType) {
        case 'b':
          obj.push(fieldLen > 0 ? str.slice(ii, ii + fieldLen) : '');
          if (fieldLen > 0) i -= fieldLen - 1;
          break;
        case 'c':
          obj.push(false);
          break;
        case 'd':
          obj.push(true);
          break;
        case 'e':
          obj.push(NaN);
          break;
        case 'f':
          obj.push(+str.slice(ii, ii + fieldLen));
          i -= fieldLen - 1;
          break;
        case 'g':
          if (fieldLen) {
            obj.push(self._parseArray(str.slice(ii, ii + fieldLen)));
            i -= fieldLen - 1;
          }
          else {
            obj.push([]);
          }
          break;
        case 'h':
          obj.push(null);
          break;
        case 'i':
          obj.push(undefined);
          break;
        case 'j':
          obj.push(new Date(str.slice(ii, ii + fieldLen)));
          i -= fieldLen - 1;
          break;
        case 'k':
          if (fieldLen) {
            obj.push(self._parseObject(str.slice(ii, ii + fieldLen)));
            i -= fieldLen - 1;
          }
          else {
            obj.push({});
          }
          break;
        case 'l':
          obj[fieldKey] = self._parseFunction(str.slice(ii, ii + fieldLen));
          i -= fieldLen - 1;
          break;
        default:
          throw new Error('Invalid entry: ' + fieldType);
      }
      fieldLen = undefined;
      fieldType = undefined;
    }
  }
  return obj;
};

/**
 * Reconstruct a string (product of .stringify()) back into a Function.
 * @param  {String} str
 * @return {Function}
 * @api private
 */
self._parseFunction = (str) => {
  var isAsync, isGenerator, i = 1, stage = 0, name, nameLen, params, paramsLen, body, bodyLen, tmp = '';
  isAsync = str[0] === '1';
  isGenerator = str[1] === '1';
  while (i++) {
    if (nameLen === undefined) {
      if (str[i] === ',') {
        nameLen = +tmp;
        tmp = '';
      }
      else {
        tmp += str[i];
      }
      continue;
    }
    if (paramsLen === undefined) {
      if (str[i] === ',') {
        paramsLen = +tmp;
        tmp = '';
      }
      else {
        tmp += str[i];
      }
      continue;
    }
    if (bodyLen === undefined) {
      if (str[i] === ',') {
        bodyLen = +tmp;
        tmp = '';
      }
      else {
        tmp += str[i];
      }
      continue;
    }
    break;
  }
  name = str.slice(i, i + nameLen) || null;
  params = str.slice(i + nameLen, i + nameLen + paramsLen) || null;
  body = str.slice(i + nameLen + paramsLen, i + nameLen + paramsLen + bodyLen) || null;
  return reconstruct({
    isAsync,
    isGenerator,
    name,
    params,
    body,
  });
};
