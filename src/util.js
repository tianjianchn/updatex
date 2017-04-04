
export function isPlainObject(value) {
  if (!value) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

const _toString = Object.prototype.toString;
export function stringify(value) {
  if (Array.isArray(value)) return `[${value}]`;

  const type = typeof value;
  if (type === 'string') return JSON.stringify(value);
  if (value && type === 'object') {
    return _toString.call(value);
  }
  return String(value);
}

export function shallowCompare(aObj, bObj) {
  if (aObj === bObj) return true;
  if (!aObj && !bObj) return true;
  if (!aObj && bObj || aObj && !bObj) return false;

  const aKeys = Object.keys(aObj),
    aKeysLen = aKeys.length;
  const bKeys = Object.keys(bObj),
    bKeysLen = bKeys.length;

  if (aKeysLen !== bKeysLen) return false;

  for (let ii = 0; ii < aKeysLen; ++ii) {
    const key = aKeys[ii];
    if (aObj[key] !== bObj[key]) return false;
  }
  return true;
}

export function clone(value) {
  if (Array.isArray(value)) return [...value];
  else return { ...value };
}
