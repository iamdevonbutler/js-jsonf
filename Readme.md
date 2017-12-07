# jsmoves [![Build Status](https://travis-ci.org/iamdevonbutler/jsmoves.svg?branch=master)](https://travis-ci.org/iamdevonbutler/jsmoves)

Move JS Objects from one live system to another.

**engines: node >= 8.x**

## Example
```javascript
const {encode, decode} = require('jsmoves');
const obj = {
  a: 1,
  b() {
    return 1;
  }
};
const str = encode(obj);
const obj1 = decode(str);
```

## Installation

```
npm i jsmoves --save
```

## API
### .encode(obj)
### .decode(str)

## Supported data types

- String
- Boolean
- Number
- Array
- Object
- Date
- Function (regular, async, generator, arrow)
- NaN
- null
- undefined

## Caveats
Function behavior is normalized and consistent; however, the parsed function may contain slight formatting differences from the original; its functionality however, will remain consistent.

## Perf
As fast, if not a bit faster, than native JSON.parse() JSON.stringify():

```javascript
// 1M iterations. Each iteration calls both encode and decode.

// jsmoves:
// milliseconds: 6833.45
// ops/sec: 146,338.965
// ---
// control (native):
// milliseconds: 7033.58
// ops/sec: 142,175.109
```

## License
MIT
