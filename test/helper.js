
import assert from 'assert';
import { isReadOnly } from '../dist/readonly';

export function shouldImmutable(prev, prevJSON, next, nextJSON, { change = true, freeze = true } = {}) {
  assert.notEqual(prev, next);

  if (change) {
    assert.notEqual(prevJSON, nextJSON);
    assert.notDeepStrictEqual(prev, next);
  }

  assert(isGeneralImmutable(prev, freeze));
  assert(isGeneralImmutable(next, freeze));

  assert.deepStrictEqual(prev, prevJSON);
  assert.deepStrictEqual(next, nextJSON);
}

function isGeneralImmutable(val, freeze) {
  if (!val || typeof val !== 'object') return true;
  return isReadOnly(val) && (freeze ? Object.isFrozen(val) : true);
}

export function shouldThrow(cb, msg) {
  try {
    cb();
  } catch (e) {
    if (msg instanceof RegExp) {
      if (msg.test(e.message)) return;
      throw new Error(`Expect exception: ${msg}, but got: ${e.message}`);
    } else {
      return assert.equal(e.message, msg);
    }
  }
  throw new Error(`Missing expected exception: ${msg}`);
}
