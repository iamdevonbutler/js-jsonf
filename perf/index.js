const microtime = require('microtime');

const {encode, decode} = require('../lib');

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

var st = microtime.now();
var n = 1000000;
var i = n;

var str, result;
while (i--) {
  str = encode(obj);
  result = decode(str);
}

var ms = (microtime.now() - st) / 1000;

console.log('jsmoves results');
console.log('milliseconds: ' + ms);
console.log('ops/sec: ' + (n / (ms / 1000)).toLocaleString() );
console.log('---');

// Control.
var st = microtime.now();
var n = 1000000;
var i = n;

var str, result;
while (i--) {
  str = JSON.stringify(obj);
  result = JSON.parse(str);
}

var ms = (microtime.now() - st) / 1000;

console.log('control results:');
console.log('milliseconds: ' + ms);
console.log('ops/sec: ' + (n / (ms / 1000)).toLocaleString() );
