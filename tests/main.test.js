'use strict';

const should = require('chai').should();
const expect = require('chai').expect;
const assert = require('chai').assert;

const {stringify, parse} = require('../lib');

var obj = {
  a: false,
  b: true,
  c: NaN,
  d: null,
  e: undefined,
  f: '',
  g: 'a$a () "" | ,,\'\'Lorfunction() {return 1}, () => {},eval("throw new Error(111)") em ipsum dolor sit amet, consec,tetur adipisicing elit. Voluptatem quis earum pariatur iste, repudiandae, quo laboriosam. Eos odit, tempore reprehenderit eius minima soluta corporis ducimus, totam quam obcaecati ex ad.',
  h: 0,
  i: 1.2,
  j: -1.2,
  k: [],
  l: {},
  m: new Date(),
};

var funcs = {
  n: function functionName(a = 1) {
    function aaa() {
      return a;
    }
    return aaa(a);
  },
  o: (a = 1, b = () => 0) => {
    return a + b();
  },
  p(a = 1, b = () => 0) {
    return a + b();
  },
  q: function* (a = 1, b = function() {return 0;}) {
    return a + b();
  },
  r: function* a(a = 1) {
    return a;
  },
  s: async function(a = 1, b = async () => 0) {
    b = await b();
    return a + b;
  },
  async t(a = 1) {
    return a;
  },
  u: async (a = 1) => {
    return a;
  },
};

var obj1 = {
  ...obj,
  ...funcs,
  y: [obj, obj],
  z: obj,
};

var obj2 = [
  obj1,
  obj1,
];

describe('jsonf: object', async () => {
  var str = stringify(obj1);
  var parsed = parse(str);

  var keys = Object.keys(obj1); // itterate over obj1. if we itterated obj3 empty arrays wouldn't error.
  keys.forEach(key => {
    it (`key: ${key}`, async () => {
      var isFunc = typeof obj1[key] === 'function';
      if (isFunc) {
        let [actual, actual1] = await callFunc(parsed[key], 1, () => 0);
        let [expected, expected1] = await callFunc(obj1[key], 1, () => 0);
        expect(actual).to.eql(expected);
        expect(actual1).to.eql(expected1);
      }
      else {
        expect(parsed[key]).to.deep.eql(obj1[key]);
      }
    });
  });
});

describe('jsonf: array', () => {
  var str = stringify(obj2);
  var parsed = parse(str);

  obj2.forEach((item, i) => { // itterate over obj2. if we itterated parsed, empty arrays would not error.
    var keys = Object.keys(item);
    keys.forEach((key) => {
      it (`item: ${i} key: ${key}`, async () => {
        if (typeof obj2[i][key] === 'function') {
          let [actual, actual1] = await callFunc(parsed[i][key], 1, () => 0);
          let [expected, expected1] = await callFunc(obj2[i][key], 1, () => 0);
          expect(actual).to.eql(expected);
          expect(actual1).to.eql(expected1);
        }
        else {
          expect(parsed[i][key]).to.eql(obj2[i][key]);
        }
      });
    });
  });
});

describe('jsonf: custom', () => {
  it ('should properly name a function (as property on object) allowing it to call itself and recurse.', () => {
    var str = stringify({
      a: function aaa(i = 0) {
        if (i < 2) {
          return aaa(i+1);
        }
        return i;
      }
    });
    var obj = parse(str);
    expect(obj.a()).to.eql(2);
  });
});

async function callFunc(func, ...params) {
  var result, result1, isAsync, isGenerator;
  isAsync = func.constructor.name === 'AsyncFunction';
  isGenerator = func.constructor.name === 'GeneratorFunction';
  if (isAsync) {
    result = await func.apply(null);
    result1 = await func.apply(null, params);
  }
  else if (isGenerator) {
    result = func.apply(null).next().value;
    result1 = func.apply(null, params).next().value;
  }
  else {
    result = func.apply(null);
    result1 = func.apply(null, params);
  }
  return [result, result1];
}
