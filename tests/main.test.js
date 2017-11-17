'use strict';

// test to make sure obj props that are functions can have a name and call themsevles
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
  n: function functionName() {
    function aaa() {}
    return 1;
  },
  o: () => {
    return 1;
  },
  p() {
    return 1;
  },
  q: function* () {
    return 1;
  },
  r: function* a() {
    return 1;
  },
  s: async function() {
    return 1;
  },
  async t() {
    return 1;
  },
  u: async () => {
    return 1;
  },
};

var obj1 = {
  ...obj,
  y: [obj, obj],
  z: obj,
};

var obj2 = [
  obj1,
  obj1,
];

describe('jsonf', () => {
  var result;
  var obj3 = stringify(obj1);
  var obj4 = parse(obj3);
  var keys = Object.keys(obj4);
  keys.forEach(key => {
    it (`key: ${key}`, async () => {
      var prop = obj4[key];
      var isFunc = typeof prop === 'function';
      if (isFunc) {
        let isAsync = prop.constructor.name === 'AsyncFunction';
        let isGenerator = prop.constructor.name === 'GeneratorFunction';
        if (isAsync) {
          result = await prop.call(null);
        }
        else if (isGenerator) {
          result = prop.call(null).next().value;
        }
        else {
          console.log(prop.toString());
          result = prop.call(null);
        }
        expect(result).to.deep.eql(1);
      }
      else {
        expect(prop).to.deep.eql(obj1[key]);
      }
    });
  });
});
