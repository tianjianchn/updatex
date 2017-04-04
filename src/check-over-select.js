
import { shallowCompare } from './util';

export default function checkOverSelect(cloned, original) {
  const { selectedPaths } = cloned.$updatex;
  const pathStrings = Object.keys(selectedPaths);
  for (let ii = 0, len = pathStrings.length; ii < len; ++ii) {
    const pathString = pathStrings[ii];
    const path = selectedPaths[pathString];

    const oldVal = getValueFromPath(original, path);
    const newVal = getValueFromPath(cloned, path);

    if (shallowCompare(newVal, oldVal)) {
      console.warn(`No value changed in path(${pathString}), you may over select path`);
    }
  }
}

function getValueFromPath(obj, path) {
  if (!obj) return;

  for (let ii = 0, len = path.length; ii < len; ++ii) {
    if (!obj) return;

    const key = path[ii];
    if (!obj.hasOwnProperty(key)) return;

    obj = obj[key];
  }

  return obj;
}
