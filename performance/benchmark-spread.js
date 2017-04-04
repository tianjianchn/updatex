
/* eslint-disable no-unused-vars, strict */

'use strict';

const assert = require('assert');
const updatex = require('..').default;
const { default: readonly, isReadOnly } = require('../dist/readonly');

const times = 100000;
const obj = { a: { b: { c: { d: { e: 1 } } } } };

console.time('Object spread operator');
for (let ii = 0; ii < times; ++ii) {
  const obj1 = { ...obj, a: { ...obj.a, b: { ...obj.a.b, c: { ...obj.a.b.c, d: { ...obj.a.b.c.d, e: 2 } } } } };
}
console.timeEnd('Object spread operator');


const path1 = 'a.b.c.d';
const path2 = path1.split('.');

assert.deepStrictEqual(obj, { a: { b: { c: { d: { e: 1 } } } } });

updatex(obj, () => null);
console.time('updatex');
for (let ii = 0; ii < times; ++ii) {
  updatex(obj, (newObj) => {
    const dd = newObj.select(path2);
    dd.e = 2;
  });
}
console.timeEnd('updatex');

assert.deepStrictEqual(obj, { a: { b: { c: { d: { e: 1 } } } } });
updatex.config('freeze', false);

console.time('updatex with freeze=false');
for (let ii = 0; ii < times; ++ii) {
  updatex(obj, (newObj) => {
    const dd = newObj.select(path2);
    dd.e = 2;
  });
}
console.timeEnd('updatex with freeze=false');
