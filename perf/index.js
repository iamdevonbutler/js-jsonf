// @todo test using actual array buffers over string buffer hack
const microtime = require('microtime');

const jsonf = require('../lib');

const st = microtime.now();
var n = 100000;
var i = n;
var str = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet nobis dignissimos, quas! Est asperiores ab beatae ex, dolor optio nostrum rerum aspernatur in corporis unde aperiam error fuga ut, illo?';

var obj = {
  a: 1,
  b: {
    c: 'string',
    d: [1,2,3],
  },
  e: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus, labore adipisci accusantium! Iure, corporis quia numquam ea error nam sunt. Labore eveniet, nobis eos tempore quis non numquam incidunt nisi!'
};

while (i--) {
  // JSON.stringify(obj);
  var x = jsonf.stringify(obj);
  console.log(x);
  return;
}

const ms = (microtime.now() - st) / 1000;

console.log(ms);
console.log( (n / (ms / 1000)).toLocaleString() );


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
