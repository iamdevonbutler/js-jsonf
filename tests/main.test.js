const should = require('chai').should();
const expect = require('chai').expect;
const assert = require('chai').assert;

const jsonf = require('../lib');

// var obj = {
//   // b: '$a Lorem ipsum dolor sit amet, consec,tetur adipisicing elit. Voluptatem quis earum pariatur iste, repudiandae, quo laboriosam. Eos odit, tempore reprehenderit eius minima soluta corporis ducimus, totam quam obcaecati ex ad.',
//   b: '$a Lorem ipsum dolor sit amet, consec,tetur adipisicing elit. Voluptatem quis earum pariatur iste, repudiandae, quo laboriosam. Eos odit, tempore reprehenderit eius minima soluta corporis ducimus, totam quam obcaecati ex ad.',
//   c: false,
//   d: true,
//   e: NaN,
//   f: 1.2,
//   g: [],
//   h: null,
//   i: undefined,
//   j: {},
//   k: new Date(),
//   l: function() {
//     // return 1;
//   },
//   // l() {
//   //   return 1;
//   // }
//   // $a: 1, // @todo test
//   // @todo add items to array.
// };
//
// var obj1 = {
//   ...obj,
//   g: [obj, obj],
//   j: obj,
// };
//
//
//
// describe('jsonf', () => {
//
//   it('should deconstruct an anonmyous function (0)', () => {
//     var obj = jsonf.deconstructFunction( () => {} );
//     expect(obj).to.eql({
//       isGenerator: false,
//       isAsync: false,
//       name: null,
//       params: null,
//       body: null,
//     });
//   });
//
//   it('should deconstruct an anonmyous function (1)', () => {
//     var obj = jsonf.deconstructFunction( () => {console.log(1)} );
//     expect(obj).to.eql({
//       isGenerator: false,
//       isAsync: false,
//       name: null,
//       params: null,
//       body: 'console.log(1)',
//     });
//   });
//
//   it('should deconstruct an anonmyous function (2)', () => {
//     var obj = jsonf.deconstructFunction( () => console.log(1) );
//     expect(obj).to.eql({
//       isGenerator: false,
//       isAsync: false,
//       name: null,
//       params: null,
//       body: 'console.log(1)',
//     });
//   });
//
//   it('should deconstruct an async function (0)', () => {
//     var obj = jsonf.deconstructFunction( async () => console.log(1) );
//     expect(obj).to.eql({
//       isGenerator: false,
//       isAsync: true,
//       name: null,
//       params: null,
//       body: 'console.log(1)',
//     });
//   });
//
//   it('should deconstruct an async function (1)', () => {
//     var obj = jsonf.deconstructFunction( async() => console.log(1) );
//     expect(obj).to.eql({
//       isGenerator: false,
//       isAsync: true,
//       name: null,
//       params: null,
//       body: 'console.log(1)',
//     });
//   });
//
//   it('should deconstruct an generator function (0)', () => {
//     var obj = jsonf.deconstructFunction( function* () { console.log(1) } );
//     expect(obj).to.eql({
//       isGenerator: true,
//       isAsync: false,
//       name: null,
//       params: null,
//       body: 'console.log(1)',
//     });
//   });
//
//   it('should deconstruct an generator function (1)', () => {
//     var obj = jsonf.deconstructFunction( function * () { console.log(1) } );
//     expect(obj).to.eql({
//       isGenerator: true,
//       isAsync: false,
//       name: null,
//       params: null,
//       body: 'console.log(1)',
//     });
//   });
//
//   it('should deconstruct an generator function (2)', () => {
//     var obj = jsonf.deconstructFunction( function *() { console.log(1) } );
//     expect(obj).to.eql({
//       isGenerator: true,
//       isAsync: false,
//       name: null,
//       params: null,
//       body: 'console.log(1)',
//     });
//   });
//
//   it('should deconstruct an generator function (2)', () => {
//     var obj = jsonf.deconstructFunction(function * aa() {function aaa() {return 2;}return aaa();});
//     console.log(obj);
//     // expect(obj).to.eql({
//     //   isGenerator: true,
//     //   isAsync: false,
//     //   name: null,
//     //   params: null,
//     //   body: 'console.log(1)',
//     // });
//   });
//
// });

// function type | async | generator | name | params | body

var trials = [];

var types = [
  (isAsync) => {
    return `${isAsync ? 'async ' : ''}${}`;
  }
];



// describe(() => {



// });
