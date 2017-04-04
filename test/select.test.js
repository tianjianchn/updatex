
import assert from 'assert';
import updatex from '..';
import { isReadOnly } from '../dist/readonly';
import { stringify } from '../dist/util';
import { shouldThrow } from './helper';

describe('select', function () {
  describe('key path', function () {
    it('should work with string path', function () {
      updatex({ a: { b: { c: 1 } } }, (obj) => {
        const obj1 = obj.select();
        assert.strictEqual(obj1, obj);

        const obj2 = obj.select('');
        assert.strictEqual(obj2, obj);

        assert(isReadOnly(obj.a.b));
        const bb = obj.select('a.b');
        assert.strictEqual(bb, obj.a.b);
        assert(!isReadOnly(bb));
        assert.deepStrictEqual(bb, { c: 1 });

        assert.deepStrictEqual(obj.$updatex.selectedPaths, { 'a.b': ['a', 'b'] });

        bb.c = 2;
      });
    });
    it('should work with array path', function () {
      updatex({ a: { b: { c: 1 } } }, (obj) => {
        const bb = obj.select(['a', 'b']);
        assert.strictEqual(bb, obj.a.b);
        assert(!isReadOnly(bb));
        assert.deepStrictEqual(bb, { c: 1 });

        assert.deepStrictEqual(obj.$updatex.selectedPaths, { 'a.b': ['a', 'b'] });

        bb.c = 2;
      });
    });
    it('should work with number path', function () {
      updatex([{ a: 1 }], (arr) => {
        const first = arr.select(0);
        assert.strictEqual(first, arr[0]);
        assert(!isReadOnly(first));
        assert.deepStrictEqual(first, { a: 1 });

        assert.deepStrictEqual(arr.$updatex.selectedPaths, { 0: ['0'] });

        first.c = 2;
      });
    });
    it('should throw without string and array path', function () {
      [false, true, {}, new Date()].forEach(check);

      function check(path) {
        shouldThrow(() => updatex({}, v => v.select(path)),
          `Invalid key path: ${stringify(path)}, expect string or array`);
      }
    });
    it('should create object on non-existent node', function () {
      const result = updatex({ a: { b: 1 } }, (obj) => {
        const cc = obj.select('a.c');
        assert.deepStrictEqual(cc, {});
      });
      assert.deepStrictEqual(result, { a: { b: 1, c: {} } });
    });
    it('should throw when there is non-object value on the path', function () {
      [1, undefined, null, false, true, '', '1'].forEach(check);

      function check(val) {
        shouldThrow(() => updatex({ a: val }, v => v.select('a')),
          `Cannot select a non-object value at a: ${stringify(val)}`);
      }
    });
  });

  describe('selected path', function () {
    it('should not change anything when selecting sub path', function () {
      updatex({ a: { b: { c: 1 } } }, (obj) => {
        const bb = obj.select('a.b');
        assert.deepStrictEqual(obj.$updatex.selectedPaths, { 'a.b': ['a', 'b'] });

        const aa = obj.select('a');
        assert.deepStrictEqual(obj.$updatex.selectedPaths, { 'a.b': ['a', 'b'] });
        assert.strictEqual(aa.b, bb);

        const bb2 = obj.select('a.b');
        assert.deepStrictEqual(obj.$updatex.selectedPaths, { 'a.b': ['a', 'b'] });
        assert.strictEqual(bb2, bb);

        bb.c = 2;
      });
    });
    it('should overwrite when selecting further path', function () {
      updatex({ a: { b: { c: 1 } } }, (obj) => {
        const aa = obj.select('a');
        assert.deepStrictEqual(obj.$updatex.selectedPaths, { a: ['a'] });

        const bb = obj.select('a.b');
        assert.deepStrictEqual(obj.$updatex.selectedPaths, { 'a.b': ['a', 'b'] });
        assert.strictEqual(aa.b, bb);

        bb.c = 2;
      });
    });
  });
});
