
import { isPlainObject, stringify, clone, shallowCompare } from './util';
import { set as setConfig } from './config';
import makeReadOnly from './readonly';
import select from './select';
import checkOverSelect from './check-over-select';

export default function updatex(value, updater) {
  if (!(Array.isArray(value) || isPlainObject(value))) return value;

  if (typeof updater !== 'function') {
    throw new TypeError(`Invalid updater: ${stringify(updater)}, expect function`);
  }

  // Make the input value readonly to prevent accidental changes on it
  makeReadOnly(value);

  // Clone first to avoid annoying reassignment, like `state = state.xxx()`.
  const cloned = clone(value);

  // Add extra properties
  Object.defineProperties(cloned, {
    select: {
      value: select,
      writable: true,
    },
    $updatex: { // intermediate stage data
      value: { selectedPaths: {} },
      writable: true,
    },
  });

  // Call the updater. All your updates should be in it
  updater(cloned);

  // If the leaf nodes not changed, warning will be shown
  // as you over select path, then try narrow your path.
  checkOverSelect(cloned, value);

  // Clear extra properties
  cloned.select = undefined;
  cloned.$updatex = undefined;

  // Only compare top nodes for performance consideration,
  // since we will give a warning if no actual changes occur
  // on sub nodes. See checkOverSelect().
  if (shallowCompare(cloned, value)) return value;

  // Make new value readonly too, so no mutation will be outside!
  makeReadOnly(cloned);

  return cloned;
}

export {
  setConfig as config,
  makeReadOnly as readonly,
};
updatex.config = setConfig;
