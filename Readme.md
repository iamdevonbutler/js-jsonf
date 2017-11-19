# jsonf

A malformed JSON parser w/ function support

---

## Supported data types

- String
- Boolean
- Number
- Array
- Object
- Date
- Function
- NaN
- null
- undefined

## Caveats

Function behavior is normalized and consistent; however, the parsed function may contain slight formatting differences from the original; its functionality however, will remain consistent.

## Perf
As fast, if not a bit faster, than native JSON.parse() JSON.stringify():

```javascript
// 1M itterations. Each itteration calls both stringify and parse.

// jsonf:
// milliseconds: 6833.45
// ops/sec: 146,338.965
// ---
// control (native):
// milliseconds: 7033.58
// ops/sec: 142,175.109
```
