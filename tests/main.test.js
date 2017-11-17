'use strict';

// Test arrays and objects as root structures

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
  obj,
  obj,
];

describe('jsonf: object', () => {
  var result, result1;

  var str = stringify(obj1);
  var obj3 = parse(str);

  var keys = Object.keys(obj3);
  keys.forEach(key => {
    it (`key: ${key}`, async () => {
      var prop = obj3[key];
      var isFunc = typeof prop === 'function';
      if (isFunc) {
        let isAsync = prop.constructor.name === 'AsyncFunction';
        let isGenerator = prop.constructor.name === 'GeneratorFunction';
        if (isAsync) {
          result = await prop.call(null);
          result1 = await prop.call(null, 1, () => 0);
        }
        else if (isGenerator) {
          result = prop.call(null).next().value;
          result1 = prop.call(null, 1, () => 0).next().value;
        }
        else {
          result = prop.call(null);
          result1 = prop.call(null, 1, () => 0);
        }
        // console.log(1, result, result1);
        expect(result).to.eql(1);
        expect(result1).to.eql(1);
      }
      else {
        expect(prop).to.deep.eql(obj1[key]);
      }
    });
  });
});

describe('jsonf: array', () => {
  var str = stringify(obj2);
  var obj3 = parse(str);
  obj3.forEach((item, i) => {
    var keys = Object.keys(item);
    keys.forEach((key) => {
      var prop = item[key];
      it (`item: ${i} key: ${key}`, () => {
        if (typeof prop === 'function') {
          expect(prop()).to.eql(obj2[i][key]());
        }
        else {
          expect(prop).to.eql(obj2[i][key]);
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
