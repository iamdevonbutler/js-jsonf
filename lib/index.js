const self = module.exports;
//
// no async generators
// test w/ functions that have lots of \n line breaks
//
//
self.parseFunction = (str) => {
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
  name = str.slice(i, i + nameLen) || 'unnamed';
  params = str.slice(i + nameLen, i + nameLen + paramsLen);
  body = str.slice(i + nameLen + paramsLen, i + nameLen + paramsLen + bodyLen);
  if (isGenerator) {
    return function* (...args) {
      return (Function(params, body))(...args);
    };
  }
  else {
    if (isAsync) {
      return async function(...args) {
        return (Function(params, body))(...args);
      };
    }
    else {
      return function(...args) {
        return (Function(params, body))(...args);
      };
    }
  }
};

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
      let val = self.stringify(value, true);
      str += val.length ? 'g' + val.length + ',' + val : 'g$ ';
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
      str += obj.length ? 'j' + obj.length + ',' + obj : 'j$ ';
    }
    else {





        str += 'l'
        + (parsed.isAsync ? 1 : 0)
        + (parsed.isGenerator ? 1 : 0)
        + (parsed.name ? parsed.name.length + ',' + parsed.name : 0)
        + (parsed.params ? parsed.params.length + ',' + parsed.params : 0)
        + (parsed.body ? parsed.body.length + ',' + parsed.body : 0);
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
      let val = self.stringify(value, true);
      str += val.length ? 'g' + val.length + ',' + val : 'g$ ';
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
      str += obj.length ? 'j' + obj.length + ',' + obj : 'j$ ';
    }
    else {
      let {name, params, body, isGenerator, isAsync} = self.deconstructFunction(value);
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

self.deconstructFunction = (func) => {
  var str, i = 0, isAsync, isGenerator, functionKeyword, name, params, body, nameTmp = '', paramsTmp = '', openSingleQuotes = false, openDoubleQuotes = false, openParens = 0;
  str = func.toString();

  isAsync = str[0] === 'a' && str[1] === 's' && str[2] === 'y' && str[3] === 'n' && str[4] === 'c';
  if (isAsync) {
    i += 5;
    if (str[i] === ' ') i += 1;
  };

  functionKeyword = str[i] === 'f' && str[i + 1] === 'u' && str[i + 2] === 'n' && str[i + 3] === 'c' && str[i + 4] === 't'
   && str[i + 5] === 'i' && str[i + 6] === 'o' && str[i + 7] === 'n';

  if (functionKeyword) i += 8;

  while (1) {
    if (isGenerator === undefined) {
      if (str[i] === ' ') {
        i++;
        continue;
      }
      if (str[i] === '*') {
        isGenerator = true;
        i += 1; // skip space - next character will be a space.
      }
      else {
        isGenerator = false;
        nameTmp += str[i];
      }
    }
    else if (name === undefined) {
      if (nameTmp === '(') {
        name = null;
        openParens++;
        if (str[i] === ')') {
          openParens--;
          params = null;
        }
        else {
          paramsTmp += str[i];
        }
      }
      else if (str[i] === '(') {
        name = nameTmp;
        openParens++;
      }
      else {
        nameTmp += str[i];
      }
    }
    else if (params === undefined) {
      if (str[i] === '"') {
        openDoubleQuotes = str[i-1] !== '\\' ? !openDoubleQuotes : openDoubleQuotes;
      }
      else if (str[i] === "'") {
        openSingleQuotes = str[i-1] !== '\\' ? !openSingleQuotes : openSingleQuotes;
      }
      else if (str[i] === '(' && !openSingleQuotes && !openDoubleQuotes) {
        openParens++;
      }
      else if (str[i] === ')' && !openSingleQuotes && !openDoubleQuotes) {
        openParens--;
        if (!openParens) {
          params = paramsTmp.trim() || null;
        }
      }
      paramsTmp += str[i];
    }
    else {
      // Parse body;
      let str1 = str.slice(i).trim();
      let ii = 0;
      if (str1[ii] === '{') {
        body = str1.slice(1,-1).trim() || null;
      }
      else if (str1[ii] === '=' && str1[ii+1] === '>') { //@todo maybe make this a else statement, if syntax is implied
        str1 = str1.slice(ii+2).trim();
        if (str1[str1.length - 1] === '}') {
          body = str1.slice(1,-1).trim() || null;
        }
        else {
          body = str1 || null;
        }
      }
      console.log(str, '\n', name, params, 1111, body, isGenerator, isAsync);
      return {name, params, body, isGenerator, isAsync};
    }
    i++;
  }
};

// string to obj
// & prefix denotes array as root data structure. $ at pos 0 is object.
self.parse = (str) => {
  // If array.
  if (str[0] === '&') {
    return self.parseArray(str.slice(1));
  }
  // If object.
  else {
    return self.parseObject(str.slice(1));
  }
};

self.parseArray = (str) => {
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
      else if (str[ii] === '$') {
        fieldLen = '$'; // $ identifies empty value.
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
          obj.push(+str.slice(ii, ii + fieldLen));
          i -= fieldLen - 1;
          break;
        case 'g':
          if (fieldLen === '$') {
            obj.push([]);
          }
          else {
            obj.push(self.parseArray(str.slice(ii, ii + fieldLen)));
            i -= fieldLen - 1;
          }
          break;
        case 'h':
          obj.push(null);
          break;
        case 'i':
          obj.push(undefined);
          break;
        case 'j':
          if (fieldLen === '$') {
            obj.push({});
          }
          else {
            obj.push(self.parseObject(str.slice(ii, ii + fieldLen)));
            i -= fieldLen - 1;
          }
          break;
        case 'k':
          obj.push(new Date(str.slice(ii, ii + fieldLen)));
          i -= fieldLen - 1;
          break;
        case 'l':
          // obj.push(eval(str.slice(ii, ii + fieldLen)));
          // i -= fieldLen - 1;
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
    // @todo what if fieldKey is a falsy value? fix other conditionals
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
      else if (str[ii] === '$') {
        fieldLen = '$'; // $ identifies empty value.
      }
      else {
        fieldLenTmp += str[ii];
      }
    }
    else {
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
          if (fieldLen === '$') {
            obj[fieldKey] = [];
          }
          else {
            obj[fieldKey] = self.parseArray(str.slice(ii, ii + fieldLen));
            i -= fieldLen - 1;
          }
          break;
        case 'h':
          obj[fieldKey] = null;
          break;
        case 'i':
          obj[fieldKey] = undefined;
          break;
        case 'j':
          if (fieldLen === '$') {
            obj[fieldKey] = {};
          }
          else {
            obj[fieldKey] = self.parseObject(str.slice(ii, ii + fieldLen));
            i -= fieldLen - 1;
          }
          break;
        case 'k':
          obj[fieldKey] = new Date(str.slice(ii, ii + fieldLen));
          i -= fieldLen - 1;
          break;
        case 'l':
          obj[fieldKey] = self.parseFunction(str.slice(ii, ii + fieldLen));
          i -= fieldLen - 1;
          break;
        default:
          throw new Error('Invalid entry: ' + fieldType);
      }
      keyLen = null;
      fieldKey = null;
      fieldType = null;
      fieldLen = null;
    }
  }
  return obj;
};
