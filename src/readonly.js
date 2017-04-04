
import { isPlainObject } from './util';
import config from './config';

// Only freeze the value in development environment
export default function makeReadOnly(value) {
  if (Array.isArray(value)) return makeArrayReadOnly(value);

  if (!value || typeof value !== 'object') return value;

  // non-empty object
  if (isPlainObject(value)) {
    return makeObjectReadOnly(value);
  }
  return value;
}

function makeArrayReadOnly(arr) {
  if (isReadOnly(arr)) return arr;

  setReadOnlyTag.call(arr);

  // deeply make value immutable
  arr.forEach((item, index) => {
    makeReadOnly(item);
  });

  if (config.freeze && !Object.isFrozen(arr)) return Object.freeze(arr);
  return arr;
}

function makeObjectReadOnly(obj) {
  if (isReadOnly(obj)) return obj;

  setReadOnlyTag.call(obj);

  // deeply make value immutable
  Object.keys(obj).forEach((key) => {
    makeReadOnly(obj[key]);
  });

  if (config.freeze && !Object.isFrozen(obj)) return Object.freeze(obj);
  return obj;
}

export const RO_TAG = '$updatex-ro';

export function isReadOnly(value) {
  return !!(value && value[RO_TAG]);
}

function setReadOnlyTag() {
  Object.defineProperty(this, RO_TAG, {
    value: true,
    configurable: false,
  });
}

