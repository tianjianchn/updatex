
import assert from 'assert';
import updatex from '..';
import { stringify } from '../dist/util';
import { shouldThrow, shouldImmutable } from './helper';

describe('updatex', function () {
  it('should only work with array and plain object', function () {
    [1, true, '1', new Date(), new Buffer('')].forEach(check);

    function check(input) {
      updatex(input, (v) => {
        throw new Error('Cannot reach here');
      });
    }
  });
  it('should work with object', function () {
    const obj = { a: 1 };
    const obj2 = updatex(obj, (newObj) => {
      newObj.a = 2;
    });

    shouldImmutable(obj, { a: 1 }, obj2, { a: 2 });
  });
  it('should work with array', function () {
    const arr = [1];
    const arr2 = updatex(arr, (newArr) => {
      newArr.push(2);
    });

    shouldImmutable(arr, [1], arr2, [1, 2]);
  });
  it('should not take care the return of callback', function () {
    const obj = { a: 1 };
    const obj2 = updatex(obj, (newObj) => {
      newObj.a = 2;
      return { b: 2 };
    });

    assert.deepStrictEqual(obj2, { a: 2 });
  });
  it('should throw with invalid updater', function () {
    [1].forEach(check);
    function check(cb) {
      shouldThrow(() => updatex({}, cb), `Invalid updater: ${stringify(cb)}, expect function`);
    }
  });
  it('should keep original value without any changes', function () {
    const obj = { a: 1 };
    const obj2 = updatex(obj, (newObj) => {
      newObj.a = 2;
      newObj.a = 1;
    });

    assert.strictEqual(obj, obj2);
    assert.deepStrictEqual(obj, { a: 1 });
  });
  it('should clear extra properties when updater end', function () {
    const obj = { a: { b: 1 } };
    const obj2 = updatex(obj, (newObj) => {
      assert(!!newObj.select);
      assert(!!newObj.$updatex);
    });
    assert(!obj2.select);
    assert(!obj2.$updatex);
  });

  describe('options', function () {
    it('should work with multiArgs option', function () {
      const obj = { a: 1 };
      updatex(obj, (...args) => {
        assert.strictEqual(args.length, 1);
      });

      updatex(obj, (...args) => {
        assert.strictEqual(args.length, 3);
        assert.deepStrictEqual(args.slice(1), ['a', 'b']);
      }, { multiArgs: ['a', 'b'] });
    });
  });

  describe('config: freeze = false', function () {
    before(function () {
      updatex.config('freeze', false);
    });
    after(function () {
      updatex.config('freeze', true);
    });
    it('should work with object', function () {
      const obj = { a: 1 };
      const obj2 = updatex(obj, (newObj) => {
        newObj.a = 2;
      });

      shouldImmutable(obj, { a: 1 }, obj2, { a: 2 }, { freeze: false });
    });
    it('should work with array', function () {
      const arr = [1];
      const arr2 = updatex(arr, (newArr) => {
        newArr.push(2);
      });

      shouldImmutable(arr, [1], arr2, [1, 2], { freeze: false });
    });
  });
});
