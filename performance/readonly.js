
/* eslint-disable no-unused-vars, strict */

'use strict';

const { default: updatex, readonly } = require('..');

const times = 10000;

const obj = { a: { b: { c: { d: { e: 1 } } } } };
console.time('Object spread operator');
for (let ii = 0; ii < times; ++ii) {
  // readonly(obj);
  const obj1 = { ...obj, a: { ...obj.a, b: { ...obj.a.b, c: { ...obj.a.b.c, d: { ...obj.a.b.c.d, e: 2 } } } } };
}
console.timeEnd('Object spread operator');

updatex.config('freeze', false);
readonly(obj);
console.time('Object spread operator');
for (let ii = 0; ii < times; ++ii) {
  // const obj = { a: { b: { c: { d: { e: 1 } } } } };
  const obj1 = { ...obj, a: { ...obj.a, b: { ...obj.a.b, c: { ...obj.a.b.c, d: { ...obj.a.b.c.d, e: 2 } } } } };
}
console.timeEnd('Object spread operator');
