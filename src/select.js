
import { stringify, clone } from './util';
import { isReadOnly } from './readonly';

const NON_EXIST_VAL = { };

// Make all nodes on the key path are mutable(clone them first)
export default function select(keyPath) {
  const keys = parseKeyPath(keyPath);

  // node on the path, it is always mutable,
  // which is cloned and safe to mutate directly
  let node;
  let original; // the node's original value
  const path = []; // the node's path

  node = this;
  for (let ii = 0, len = keys.length; ii < len; ++ii) {
    const key = keys[ii];
    path.push(key);

    let child;
    if (!node.hasOwnProperty(key)) {
      original = NON_EXIST_VAL;
      child = {};
      node[key] = child;
    } else {
      child = node[key];
      if (!child || typeof child !== 'object') {
        throw new TypeError(`Cannot select a non-object value at ${path.join('.')}: ${stringify(child)}`);
      }

      if (isReadOnly(child)) {
        original = child;
        child = clone(child);
        node[key] = child;
      }
      // else means child already has been selected in prev operation
    }

    node = child;

    // No original value means that key path is sub string of the prev selected path;
    if (original) addSelectedPath.call(this, path);
  }

  return node;
}

function addSelectedPath(path) {
  const pathString = path.join('.');
  const { selectedPaths } = this.$updatex;
  if (selectedPaths[pathString]) return;

  // Check whether prev selected path is sub string of current
  const selectedPathStrings = Object.keys(selectedPaths);
  for (let ii = 0, len = selectedPathStrings.length; ii < len; ++ii) {
    const selectedPathString = selectedPathStrings[ii],
      matchPathString = `${selectedPathString}.`;
    if (pathString.slice(0, matchPathString.length) === matchPathString) {
      delete selectedPaths[selectedPathString];
      break;
    }
  }

  selectedPaths[pathString] = path;
}

function parseKeyPath(keyPath) {
  if (keyPath === null || keyPath === undefined) return [];

  if (Array.isArray(keyPath)) {
    const result = [];
    for (let ii = 0, len = keyPath.length; ii < len; ++ii) {
      let key = keyPath[ii];
      if (key === undefined || key === null) continue;
      if (typeof key !== 'string') key += '';
      result.push(key);
    }
    return result;
  } else {
    const type = typeof keyPath;
    if (type === 'string') {
      return keyPath.split('.').filter(key => !!key);
    } else if (type === 'number') {
      return [`${keyPath}`];
    } else {
      throw new TypeError(`Invalid key path: ${stringify(keyPath)}, expect string or array`);
    }
  }
}
