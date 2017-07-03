const should = require('chai').should();
const expect = require('chai').expect;
const assert = require('chai').assert;

const jsonf = require('../lib');

var obj = {
  // b: '$a Lorem ipsum dolor sit amet, consec,tetur adipisicing elit. Voluptatem quis earum pariatur iste, repudiandae, quo laboriosam. Eos odit, tempore reprehenderit eius minima soluta corporis ducimus, totam quam obcaecati ex ad.',
  b: '$a Lorem ipsum dolor sit amet, consec,tetur adipisicing elit. Voluptatem quis earum pariatur iste, repudiandae, quo laboriosam. Eos odit, tempore reprehenderit eius minima soluta corporis ducimus, totam quam obcaecati ex ad.',
  c: false,
  d: true,
  e: NaN,
  f: 1.2,
  g: [],
  h: null,
  i: undefined,
  j: {},
  k: new Date(),
  l: function() {
    // return 1;
  },
  // l() {
  //   return 1;
  // }
  // $a: 1, // @todo test
  // @todo add items to array.
};

var obj1 = {
  ...obj,
  g: [obj, obj],
  j: obj,
};

describe('jsonf', () => {

  it('should eat hardboiled eggs', () => {
    var str = jsonf.stringifyFunction( () => {} );
    console.log(str);
    // var str = jsonf.stringify(obj);
    // console.log(str);
    // var obj2 = jsonf.parse(str);
    // console.log(obj2);
    // expect(obj2).to.deep.equal(obj1);
  });

});
