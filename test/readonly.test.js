
import assert from 'assert';
import updatex from '..';
import { isReadOnly, RO_TAG } from '../dist/readonly';
import { shouldThrow } from './helper';

describe('readonly', function () {
  describe('array', function () {
    it('should make input array readonly', function () {
      const arr = [1, 2];
      assert(!Object.isFrozen(arr));

      const arr1 = updatex(arr, v => null);
      assert.strictEqual(arr, arr1);
      assert.strictEqual(arr[0], 1);
      assert.strictEqual(arr.length, 2);
      assert(Object.isFrozen(arr));
    });
    it('should throw on a frozen array', function () {
      const arr = Object.freeze([1, 2]);
      assert(Object.isFrozen(arr));
      shouldThrow(() => updatex(arr, v => null), `Cannot define property:${RO_TAG}, object is not extensible.`);
    });
    it('should make array deep readonly', function () {
      const arr = updatex([[[]]], v => null);
      assert(isReadOnly(arr));
      assert(isReadOnly(arr[0]));
      assert(isReadOnly(arr[0][0]));
      assert.deepStrictEqual(arr, [[[]]]);
    });
    it('should be ok for circular-reference arrays', function () {
      const arr1 = [1],
        arr2 = [2];
      arr1.push(arr2);
      arr2.push(arr1);
      updatex(arr1, v => null);
      assert(isReadOnly(arr1));
      assert(isReadOnly(arr2));
    });
    it('should not break common use cases of array', function () {
      const arr = updatex([1, 'a', [3]], v => null);
      assert.deepStrictEqual(arr, [1, 'a', [3]]);
      assert.strictEqual(arr.length, 3);

      const result1 = [];
      for (const ii in arr) result1.push([ii, arr[ii]]);
      assert.deepStrictEqual(result1, [['0', 1], ['1', 'a'], ['2', [3]]]);

      const result2 = [];
      for (const vv of arr) result2.push(vv);
      assert.deepStrictEqual(result2, [1, 'a', [3]]);

      assert.deepStrictEqual(Object.keys(arr), ['0', '1', '2']);
      assert.deepStrictEqual(JSON.stringify(arr), '[1,"a",[3]]');
    });
    it('should throw when assigning new key or value', function () {
      const arr = [-1];
      arr[0] = -2;
      arr[1] = -1;
      delete arr[1];
      Object.defineProperty(arr, 0, { value: -1 });
      arr.splice(0, 1, -2, -3);
      assert.deepStrictEqual(arr, [-2, -3]);

      updatex(arr, v => null);
      shouldThrow(() => (arr[0] = 1), /Cannot assign to read only property '0' of object '\[object Array\]'/);
      assert.deepStrictEqual(arr, [-2, -3]);
      shouldThrow(() => (arr[3] = 1), /Can't add property 3, object is not extensible/);
      assert.deepStrictEqual(arr, [-2, -3]);
      shouldThrow(() => delete arr[0], /Cannot delete property '0' of \[object Array\]/);
      assert.deepStrictEqual(arr, [-2, -3]);
      shouldThrow(() => Object.defineProperty(arr, 0, { value: 1 }), /Cannot redefine property: 0/);
    });
    it('should throw when changing the prototype of readonly array', function () {
      const proto = Object.create(Array.prototype, { a: { value: 1 } });
      const arr = [-1];
      Object.setPrototypeOf(arr, proto);
      assert.deepStrictEqual(arr.a, 1);

      const arr1 = updatex([-1], v => null);
      shouldThrow(() => Object.setPrototypeOf(arr1, proto), /\[object Array\] is not extensible/);
      shouldThrow(() => (arr1.__proto__ = proto), /\[object Array\] is not extensible/);
    });
    it('should throw when calling mutation methods', function () {
      const arr = updatex([-2, -3], v => null);
      assert.deepStrictEqual(arr, [-2, -3]);
      shouldThrow(() => arr.splice(0, 1), /Cannot add\/remove sealed array elements/);
      assert.deepStrictEqual(arr, [-2, -3]);
      shouldThrow(() => arr.splice(0, 1, 2), /Cannot modify frozen array elements/);
      assert.deepStrictEqual(arr, [-2, -3]);
      shouldThrow(() => arr.push(0), /Can't add property 2, object is not extensible/);
      assert.deepStrictEqual(arr, [-2, -3]);
      shouldThrow(() => arr.pop(), 'Cannot delete property \'1\' of [object Array]');
      assert.deepStrictEqual(arr, [-2, -3]);
      shouldThrow(() => arr.shift(0), /Cannot add\/remove sealed array elements/);
      assert.deepStrictEqual(arr, [-2, -3]);
      shouldThrow(() => arr.unshift(), /Cannot assign to read only property 'length' of object '\[object Array\]'/);
      assert.deepStrictEqual(arr, [-2, -3]);
      shouldThrow(() => arr.sort(), /Cannot assign to read only property '1' of object '\[object Array\]'/);
      assert.deepStrictEqual(arr, [-2, -3]);
      shouldThrow(() => arr.reverse(), 'Cannot assign to read only property \'0\' of object \'[object Array]\'');
      assert.deepStrictEqual(arr, [-2, -3]);
      shouldThrow(() => arr.fill(1), /Cannot modify frozen array elements/);
      assert.deepStrictEqual(arr, [-2, -3]);
    });
  });

  describe('object', function () {
    it('should make input object readonly', function () {
      const obj = { a: 1 };
      assert(!Object.isFrozen(obj));

      const obj1 = updatex(obj, v => null);
      assert.strictEqual(obj, obj1);
      assert.strictEqual(obj.a, 1);
      assert.strictEqual(Object.keys(obj).length, 1);
      assert(Object.isFrozen(obj));
    });
    it('should throw on a frozen object', function () {
      const obj = Object.freeze({ a: 1 });
      assert(Object.isFrozen(obj));
      shouldThrow(() => updatex(obj, v => null), `Cannot define property:${RO_TAG}, object is not extensible.`);
    });
    it('should make object deep readonly', function () {
      const obj = updatex({ a: { b: {} } }, v => null);
      assert(isReadOnly(obj));
      assert(isReadOnly(obj.a));
      assert(isReadOnly(obj.a.b));
      assert.deepStrictEqual(obj, { a: { b: {} } });
    });
    it('should be ok for circular-reference arrays', function () {
      const obj1 = { a: 1 },
        obj2 = { b: 2 };
      obj1.c = obj2;
      obj2.c = obj1;
      updatex(obj1, v => null);
      assert(isReadOnly(obj1));
      assert(isReadOnly(obj2));
    });
    it('should work with Object.create()', function () {
      const obj = updatex(Object.create(null), v => null);
      assert(isReadOnly(obj));
    });
    it('should throw when assigning new key or value', function () {
      const obj = { a: 1 };
      obj.b = 2;
      delete obj.a;
      Object.defineProperty(obj, 'c', { value: 3, enumerable: true });
      assert.deepStrictEqual(obj, { b: 2, c: 3 });

      updatex(obj, v => null);
      shouldThrow(() => (obj.b = -2), /Cannot assign to read only property 'b' of object '#<Object>'/);
      assert.deepStrictEqual(obj, { b: 2, c: 3 });
      shouldThrow(() => (obj.d = 4), /Can't add property d, object is not extensible/);
      assert.deepStrictEqual(obj, { b: 2, c: 3 });
      shouldThrow(() => delete obj.b, /Cannot delete property 'b' of #<Object>/);
      assert.deepStrictEqual(obj, { b: 2, c: 3 });
      shouldThrow(() => Object.defineProperty(obj, 'c', { value: 4 }), /Cannot redefine property: c/);
    });
  });
  describe('others should not be readonly', function () {
    it('should work', function () {
      updatex(1);
      updatex(true);
      updatex('hello');
      updatex(new Date());
      updatex(/ddd/);
    });
  });
  describe('config: freeze = false', function () {
    before(function () {
      updatex.config('freeze', false);
    });
    after(function () {
      updatex.config('freeze', true);
    });
    it('should make input array readonly', function () {
      const arr = [1, 2];
      const arr1 = updatex(arr, v => null);
      assert.strictEqual(arr, arr1);
      assert.deepStrictEqual(arr, [1, 2]);
      assert(!Object.isFrozen(arr));
      assert(isReadOnly(arr));
    });
    it('should make input object readonly', function () {
      const obj = { a: 1 };
      const obj1 = updatex(obj, v => null);
      assert.strictEqual(obj, obj1);
      assert.deepStrictEqual(obj, { a: 1 });
      assert(!Object.isFrozen(obj));
      assert(isReadOnly(obj));
    });
  });
});
