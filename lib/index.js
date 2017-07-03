const self = module.exports;

// obj to string
// @note order is important.
self.stringify = (obj) => {
  var value, str = '';
  for (let key, keys = Object.keys(obj); key = keys.shift();) {
    str += '$a' + self.escapeString(key) + '$a';
    value = obj[key];
    if (typeof value === 'string') {
      str += '$b' + self.escapeString(value);
    }
    else if (value === false) {
      str += '$c';
    }
    else if (value === true) {
      str += '$d';
    }
    else if (typeof value === 'number') {
      if (Number.isNaN(value)) {
        str += '$e';
      }
      else {
        str += '$f' + value;
      }
    }
    else if (Array.isArray(value)) {
      str += '$g';
      for (let item; item = value.shift();) {
        str += self.stringify(item);
      }
    }
    else if (value === null) {
      str += '$h';
    }
    else if (value === undefined) {
      str += '$i';
    }
    else if (value instanceof Date) {
      str += '$k' + value.toString();
    }
    else if (typeof value === 'object') {
      str += '$j' + self.stringify(value);
    }
    else {
      str += '$l' + value.toString();
    }
  }
  return str;
};

// string to obj
// @todo need to strip $ from key and strings.
self.parse = (str) => {
  var obj = {}, i = str.length, keyBuffer = '', buffer = '', captureKeys = false, fieldType;
  while (i--) {
    // $akey$a$basdfasdfads
    if (str[i] === 'a' && str[i - 1] === '$' && str[i - 2] !== '$') {
      // i -= i > 2 ? 2 : 0; // we skip over $a.
      if (keyBuffer) {
        fieldType = buffer.slice(0, 2);
        buffer = buffer.slice(2, -2);
        keyBuffer = keyBuffer.slice(0, -2);
        switch (fieldType) {
          case '$b':
            obj[keyBuffer] = buffer; // @todo escape string.
            break;
          case '$c':
            obj[keyBuffer] = false;
            break;
          case '$d':
            obj[keyBuffer] = true;
            break;
          case '$e':
            obj[keyBuffer] = NaN;
            break;
          case '$f':
            obj[keyBuffer] = +buffer;
            break;
          case '$g':
            obj[keyBuffer] = self.parse(buffer);
            break;
          case '$h':
            obj[keyBuffer] = null;
            break;
          case '$i':
            obj[keyBuffer] = undefined;
            break;
          case '$j':
            obj[keyBuffer] = self.parse(buffer);
            break;
          case '$k':
            obj[keyBuffer] = new Date(buffer);
            break;
          case '$l':
            // obj[keyBuffer] = eval(buffer);
            break;
          default:
            throw new Error('Invalid entry: ' + fieldType);
        }
        buffer = '';
        keyBuffer = '';
      }
      captureKeys = !captureKeys;
    }

    if (captureKeys) {
      keyBuffer = str[i] + keyBuffer;
    }
    else {
      buffer = str[i] + buffer;
    }
  }
  return obj;
};

self.escapeString = (str) => {
  var expect, obj = '';
  var i = str.length;
  while (i--) {
    if (str[i] === 'a') {
      expect = true;
      obj = str[i] + obj;
    }
    else if (expect) {
      expect = false;
      if (str[i] === '$') {
        obj = '$' + str[i] + obj;
      }
      else {
        obj = str[i] + obj;
      }
    }
    else {
      obj = str[i] + obj;
    }
  }
  return obj;
};
