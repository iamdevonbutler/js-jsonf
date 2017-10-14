// @todo test using actual array buffers over string buffer hack
// @todo gotta do arrays and objects.
const microtime = require('microtime');

const jsonf = require('../lib');

const st = microtime.now();
var n = 1000000;
var i = n;
var str = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet nobis dignissimos, quas! Est asperiores ab beatae ex, dolor optio nostrum rerum aspernatur in corporis unde aperiam error fuga ut, illo?';

var obj = {
  // a: 1,
  // b: {
    // c: 'string',
    // d: [111,222,333],
  // },
  // e: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus, labore adipisci accusantium! Iure, corporis quia numquam ea error nam sunt. Labore eveniet, nobis eos tempore quis non numquam incidunt nisi!',
  f: {},
  g: [],
  h: function*() {

    console.log(1);
  },
  // h(a,b) { console.log(1); },
  // u: () => {

  // },
  // i: '',
  // j: true,
  // k: false,
  // l: null,
  // m: undefined,
  // n: NaN,
};

// @todo empty function
//
// function() {}
// function*() {}
// function name() {}
// function* name() {}
// {
//   name: function() {},
//   name1: () => {},
//   name1: ()* => {},
//   name2() {},
// }
// var name = function() {};
// var name = function*() {};
// var obj = [111,222,333, {a: 1}, [1,2]];

obj = {
  name: function aaa() {console.log(1);},
  name0: function() {console.log(1);},
  name1: () => {console.log(1);},
  name2: function* () {},
  name2: function* aaa () {},
  name3() {console.log(1);},
  name4: async function() {console.log(1);},
  name4: async function aaa() {console.log(1);},
  name5: async () => {console.log(1);},
};

var str = jsonf.stringify(obj);
console.log(jsonf.parse(str));
return;


while (i--) {
// var str = jsonf.stringify(obj);
}

const ms = (microtime.now() - st) / 1000;

console.log(ms);
console.log( (n / (ms / 1000)).toLocaleString() );
