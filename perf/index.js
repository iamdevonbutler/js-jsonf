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

// js-jsonf
var startTime = Date.now();
var n = 1000000;
var i = n;

var str, result;
while (i--) {
  str = encode(obj);
  result = decode(str);
}

var ms = (Date.now() - startTime);

console.log('js-jsonf results');
console.log('milliseconds: ' + ms);
console.log('ops/ms: ' + (n / ms).toLocaleString() );
console.log('---');

// native.
var startTime = Date.now();
var n = 1000000;
var i = n;

var str, result;
while (i--) {
  str = JSON.stringify(obj);
  result = JSON.parse(str);
}

var ms = (Date.now() - startTime);

console.log('native results:');
console.log('milliseconds: ' + ms);
console.log('ops/sec: ' + (n / ms).toLocaleString() );
