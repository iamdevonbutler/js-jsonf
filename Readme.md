# js-jsonf [![Build Status](https://travis-ci.org/iamdevonbutler/js-jsonf.svg?branch=master)](https://travis-ci.org/iamdevonbutler/js-jsonf)

Encode and decode JS Objects w/ function support.

**engines: node >= 9.x**

## Example
```javascript
const {encode, decode} = require('js-jsonf');
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
npm i js-jsonf --save
```

## API
### .encode(obj, [throwOnInvalidType = false])
Returns `false` given an invalid type.

### .decode(str, [throwOnInvalidSyntax = false])
Returns `undefined` given a invalid syntax.

## Supported data types

- String
- Boolean
- Number
- Array
- Object
- Date
- Function (all combinations of: regular, async, generator, arrow)
- NaN
- null
- undefined

*All types are supported when wrapped in a function.*

## Caveats
Function behavior is normalized and consistent; however, the parsed function may contain slight formatting differences from the original; its functionality however, will remain consistent.

Don't used `undefined` as a property value - use `null` instead. A value of `undefined` will cause encoding errors.

`Symbols` and `Errors` are **not** supported.

## Perf
As fast as native JSON.parse() JSON.stringify():

```javascript
// 1M iterations. Each iteration calls both encode and decode.

// js-jsonf:
// milliseconds: 6833.45
// ops/sec: 146,338.965
// ---
// control (native):
// milliseconds: 7033.58
// ops/sec: 142,175.109
```

## License
MIT
