const self = module.exports;

// obj to string
self.stringify = (obj, inside = false) => {
  if (Array.isArray(obj)) {
    return (!inside ? '&' : '') + self.stringifyArray(obj);
  }
  else {
    return (!inside ? '$' : '') + self.stringifyObject(obj);
  }
};

// @note order of conditionals is important.
self.stringifyArray = (obj) => {
  var str = '';
  for (let value; value = obj.shift();) {
    if (typeof value === 'string') {
      str += 'b' + value.length + ',' + value;
    }
    else if (value === false) {
      str += 'c';
    }
    else if (value === true) {
      str += 'd';
    }
    else if (typeof value === 'number') {
      if (Number.isNaN(value)) {
        str += 'e';
      }
      else {
        str += 'f' + value.toString().length + ',' + value;
      }
    }
    else if (Array.isArray(value)) {
      str += 'g';
      let val = self.stringify(value, true);
      str += val.length + ',' + val;
    }
    else if (value === null) {
      str += 'h';
    }
    else if (value === undefined) {
      str += 'i';
    }
    else if (value instanceof Date) {
      str += 'k' + value.toString().length + ',' + value.toString();
    }
    else if (typeof value === 'object') {
      let obj = self.stringify(value, true);
      str += 'j' + obj.length + ',' + obj;
    }
    else {
      let obj = value.toString();
      str += 'l' + obj.length + ',' + obj;
    }
  }
  return str;
};

// @note order of conditionals is important.
self.stringifyObject = (obj) => {
  var str = '', value;
  for (let key, keys = Object.keys(obj); key = keys.shift();) {
    str += key.length + '|' + key;
    value = obj[key];
    if (typeof value === 'string') {
      str += 'b' + value.length + ',' + value;
    }
    else if (value === false) {
      str += 'c';
    }
    else if (value === true) {
      str += 'd';
    }
    else if (typeof value === 'number') {
      if (Number.isNaN(value)) {
        str += 'e';
      }
      else {
        str += 'f' + value.toString().length + ',' + value;
      }
    }
    else if (Array.isArray(value)) {
      str += 'g';
      let val = self.stringify(value, true);
      str += val.length + ',' + val;
    }
    else if (value === null) {
      str += 'h';
    }
    else if (value === undefined) {
      str += 'i';
    }
    else if (value instanceof Date) {
      str += 'k' + value.toString().length + ',' + value.toString();
    }
    else if (typeof value === 'object') {
      let obj = self.stringify(value, true);
      str += 'j' + obj.length + ',' + obj;
    }
    else {
      let obj = value.toString();
      str += 'l' + obj.length + ',' + obj;
    }
  }
  return str;
};

/*********** parse ***********/

// string to obj
// & prefix denotes array as root data structure. $ at pos 0 is object.
self.parse = (str) => {
  // If array.
  if (str[0] === '&') {
    return self.parseArray(str.slice(1));
  }
  // If object.
  else if (str[0] === '$') {
    return self.parseObject(str.slice(1));
  }
  else {
    return self.parseObject(str);
  }
};

self.parseArray = (str) => {
  console.log(str);
  var obj = [], len = str.length, i = len, ii, fieldType, fieldLen, fieldLenTmp = '';
  while (i--) {
    ii = len - i - 1;
    if (!fieldType) {
      fieldType = str[ii];
    }
    else if (!fieldLen && 'cdehi'.indexOf(fieldType) === -1) {
      if (str[ii] === ',') {
        fieldLen = +fieldLenTmp;
        fieldLenTmp = '';
      }
      else {
        fieldLenTmp += str[ii];
      }
    }
    else {
      switch (fieldType) {
        case 'b':
          obj.push(str.slice(ii, ii + fieldLen));
          i -= fieldLen - 1;
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
          obj.push(str.slice(ii, ii + fieldLen));
          i -= fieldLen - 1;
          break;
        case 'g':
          obj.push(self.parseArray(str.slice(ii, ii + fieldLen)));
          i -= fieldLen - 1;
          break;
        case 'h':
          obj.push(null);
          break;
        case 'i':
          obj.push(undefined);
          break;
        case 'j':
        console.log();
          obj.push(self.parseObject(str.slice(ii, ii + fieldLen)));
          i -= fieldLen - 1;
          break;
        case 'k':
          obj.push(new Date(str.slice(ii, ii + fieldLen)));
          i -= fieldLen - 1;
          break;
        case 'l':
          obj.push(eval(str.slice(ii, ii + fieldLen)));
          i -= fieldLen - 1;
          break;
        default:
          throw new Error('Invalid entry: ' + fieldType);
      }
      fieldLen = null;
      fieldType = null;
    }
  }
  return obj;
};

self.parseObject = (str) => {
  console.log(str);
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
    else if (!fieldKey) {
      fieldKey = str.slice(ii, ii + keyLen);
      i -= keyLen - 1;
    }
    else if (!fieldType) {
      fieldType = str[ii];
    }
    else if (!fieldLen && 'cdehi'.indexOf(fieldType) === -1) {
      if (str[ii] === ',') {
        fieldLen = +fieldLenTmp;
        fieldLenTmp = '';
      }
      else {
        fieldLenTmp += str[ii];
      }
    }
    else {
      console.log(obj);
      switch (fieldType) {
        case 'b':
          obj[fieldKey] = str.slice(ii, ii + fieldLen);
          i -= fieldLen - 1;
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
          obj[fieldKey] = self.parseArray(str.slice(ii, ii + fieldLen));
          i -= fieldLen - 1;
          break;
        case 'h':
          obj[fieldKey] = null;
          break;
        case 'i':
          obj[fieldKey] = undefined;
          break;
        case 'j':
          obj[fieldKey] = self.parseObject(str.slice(ii, ii + fieldLen));
          i -= fieldLen - 1;
          break;
        case 'k':
          obj[fieldKey] = new Date(str.slice(ii, ii + fieldLen));
          i -= fieldLen - 1;
          break;
        case 'l':
          obj[fieldKey] = eval(str.slice(ii, ii + fieldLen));
          i -= fieldLen - 1;
          break;
        default:
          throw new Error('Invalid entry: ' + fieldType);
      }
      fieldLen = null;
      fieldType = null;
    }
  }
  return obj;
};
