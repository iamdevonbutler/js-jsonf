const self = module.exports;

// obj to string
self.stringify = (obj) => {
  var value, keyBuffer = '', bodyBuffer = '', key, keys = Object.keys(obj), i = 0, delimClose = '}', delimOpen = '{';
  while (key = keys.shift()) {
    value = obj[key];
    if (typeof value === 'string') {
      let len = value.length;
      keyBuffer = len + i + 'a' + delimOpen + key + delimClose + keyBuffer;
      bodyBuffer = value + bodyBuffer;
      i += len;
    }
    else if (value === false) {
      keyBuffer = 'b' + delimOpen + key + delimClose + keyBuffer;
    }
    else if (value === true) {
      keyBuffer = 'c' + delimOpen + key + delimClose + keyBuffer;
    }
    else if (typeof value === 'number') {
      if (Number.isNaN(value)) {
        keyBuffer = 'd' + delimOpen + key + delimClose + keyBuffer;
      }
      else {
        let len = (value+'').length;
        keyBuffer = len + i + 'e' + delimOpen + key + delimClose + keyBuffer;
        bodyBuffer = value + bodyBuffer;
        i += len;
      }
    }
    else if (Array.isArray(value)) {
      if (value.length) {
        let str, len, pos = [];
        for (let item; item = value.shift();) {
          str = self.stringify(item);
          len = str.length;
          bodyBuffer = str + bodyBuffer;
          pos.unshift(len + i);
          i += len;
        }
        keyBuffer = pos.join(',') + 'f' + delimOpen + key + delimClose + keyBuffer;
      }
      else {
        keyBuffer = 'g' + delimOpen + key + delimClose + keyBuffer;
      }
    }
    else if (value === null) {
      keyBuffer = 'h' + delimOpen + key + delimClose + keyBuffer;
    }
    else if (value === undefined) {
      keyBuffer = 'i' + delimOpen + key + delimClose + keyBuffer;
    }
    else if (value instanceof Date) {
      let str = value.toString();
      let len = str.length;
      keyBuffer = len + i + 'j' + delimOpen + key + delimClose + keyBuffer;
      bodyBuffer = str + bodyBuffer;
      i += len;
    }
    else if (typeof value === 'object') {
      let str = self.stringify(value);
      let len = str.length;
      keyBuffer = len + i + 'k' + delimOpen + key + delimClose + keyBuffer;
      bodyBuffer = str + bodyBuffer;
      i += len;
    }
    else {
      let str = self.stringifyFunction(value);
      let len = str.length;
      keyBuffer = len + i + 'l' + delimOpen + key + delimClose + keyBuffer;
      bodyBuffer = str + bodyBuffer;
      i += len;
    }
  }
  return bodyBuffer + '|' + keyBuffer;
};

self.stringifyFunction = (value) => {
  var string, i, paramBuffer = '', bodyBuffer = '', capture = [], shouldBufferBody, shouldBufferParams, stage = 0, wait;
  string = value.toString();
  i = string.length;
  while (i--) {
    if (stage === 0) {
      if (string[i] === '}') {
        capture.push(1);
        bodyBuffer = string[i] + bodyBuffer;
      }
      else if (string[i] === '{') {
        capture.pop();
        bodyBuffer = string[i] + bodyBuffer;
        if (!capture.length) {
          stage = 1;
          wait = true;
        }
      }
      else {
        bodyBuffer = string[i] + bodyBuffer;
      }
    }
    else {
      if (string[i] === ')') {
        capture.push(1);
        wait = false;
        paramBuffer = string[i] + paramBuffer;
      }
      else if (string[i] === '(') {
        capture.pop(1);
        paramBuffer = string[i] + paramBuffer;
        if (!capture.length) {
          return `${paramBuffer} => ${bodyBuffer}`;
        }
      }
      else if (wait) {
        continue;
      }
      else {
        paramBuffer = string[i] + paramBuffer;
      }
    }
  };
};

// string to obj
// @todo need to strip $ from key and strings.
// $akey$a$basdfasdfads
self.parse = (str) => {
  var obj = {}, len = str.length, i = len, keyBuffer = '', bodyBuffer = '', value, capture = [], stage = 0, state = [], activeState, iOffset;
  while (i--) {
    value = str[i];
    let obj1 = {};
    // Get key.
    if (stage === 0) {
      if (value === '}') {
        capture.push(1);
      }
      else if (value === "{") {
        capture.pop();
        if (!capture.length) {
          console.log(keyBuffer);
          obj1.key = keyBuffer;
          keyBuffer = '';
          stage = 1;
        }
      }
    }
    // Get type.
    else if (stage === 1) {
      console.log(value);
      obj1.type = value;
      stage = 2;
    }
    // Get pos.
    else if (stage === 2) {
      if (value === '}') {
        capture.pop();
        stage = 1;
        obj1.pos = keyBuffer.split(',');
        keyBuffer = '';
        state.push(obj1);
      }
      else if (value === '|') {
        capture.pop();
        stage = 3;
        activeState = state.shift();
        iOffset = i;
      }
      else if (!capture.length) {
        capture.push(1);
      }
    }
    else if (stage === 3) {
      return;
      bodyBuffer = value + bodyBuffer;
      if (activeState.pos[0] == iOffset - i) {
        console.log(1);
        switch (activeState.type) {
          case 'a':
            obj[activeState.key] = bodyBuffer;
            bodyBuffer = '';
            break;
          case 'b':
            obj[activeState.key] = false;
            break;
          case 'c':
            obj[activeState.key] = true;
            break;
          case 'd':
            obj[activeState.key] = NaN;
            break;
          case 'e':
            obj[activeState.key] = +bodyBuffer;
            bodyBuffer = '';
            break;
          case 'f':
            obj[activeState.key] = self.parse(bodyBuffer);
            bodyBuffer = '';
            break;
          case 'g':
            obj[activeState.key] = [];
            break;
          case 'h':
            obj[activeState.key] = null;
            break;
          case 'i':
            obj[activeState.key] = undefined;
            break;
          case 'j':
            obj[activeState.key] = self.parse(bodyBuffer);
            bodyBuffer = '';
            break;
          case 'k':
            obj[activeState.key] = new Date(bodyBuffer);
            bodyBuffer = '';
            break;
          case 'l':
            obj[activeState.key] = eval(bodyBuffer);
            bodyBuffer = '';
            break;
          default:
            throw new Error('Invalid entry: ' + activeState.type);
        }
        if (!activeState.pos.shift()) activeState = state.shift();
      }
    }

    if (capture.length) {
      keyBuffer = value + keyBuffer;
    }

  }
  return obj;
};
