'use strict';

// no async generators

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
  n: function() {
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
  t: () => {
    return 1;
  },
  async u() {
    return 1;
  },
  v: async () => {
    return 1;
  },
};

var obj1 = {
  ...obj,
  w: [obj, obj],
  x: obj,
};

describe('jsonf', () => {
  it ('should work properly', () => {
    var obj2 = stringify(obj);
    // console.log(obj2);
    var obj3 = parse(obj2);
    console.log(obj3);
    expect(obj3).to.deep.eql(obj);
  });

  // it ('should work properly', () => {
  //   var obj2 = stringify(obj1);
  //   // console.log(obj2);
  //   var obj3 = parse(obj2);
  //   console.log(obj3);
  //   expect(obj3).to.deep.eql(obj1);
  // });

});
