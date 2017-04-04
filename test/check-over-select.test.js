
import assert from 'assert';
import updatex from '..';

describe('check over-select', function () {
  const _warn = console.warn;
  let message;
  before(function () {
    console.warn = (msg) => {
      message = msg;
    };
  });
  after(function () {
    console.warn = _warn;
  });
  afterEach(function () {
    message = null;
  });

  it('shoud not warn over-select when value changed', function () {
    updatex({ a: { b: { c: 1 } } }, (obj) => {
      const bb = obj.select('a.b');
      bb.c = 2;
    });
    assert(!message, 'Expect no over select');
  });
  it('should warn over-select when value is not changed', function () {
    updatex({ a: { b: { c: 1 } } }, (obj) => {
      const bb = obj.select('a.b');
      bb.c = 1;
    });

    assert.equal(message, 'No value changed in path(a.b), you may over select path');
  });
});
