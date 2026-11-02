/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns shallow copy of an object.
 *
 * @param {Object} obj - an object to copy
 * @return {Object}
 */
function shallowCopy(obj) {
  const assignMethod = 'assign';
  return Object[assignMethod]({}, obj);
}

/**
 * Merges array of objects into a single object. If there are overlapping keys, the values
 * should be summed.
 *
 * @param {Object[]} objects - The array of objects to merge
 * @return {Object} - The merged object
 */
function mergeObjects(objects) {
  const result = {};

  objects.forEach((o) => {
    Object.entries(o).forEach(([k, v]) => {
      result[k] = (result[k] || 0) + v;
    });
  });

  return result;
}

/**
 * Removes a properties from an object.
 *
 * @param {Object} obj - The object from which to remove the property
 * @param {string[]} keys - The keys of the properties to remove
 * @return {Object} - The object with the specified key removed
 */
function removeProperties(obj, keys) {
  const target = obj;

  keys.forEach((k) => {
    delete target[k];
  });

  return target;
}

/**
 * Compares two source objects. Returns true if the objects are equal and false otherwise.
 * There are no nested objects.
 *
 * @param {Object} obj1 - The first object to compare
 * @param {Object} obj2 - The second object to compare
 * @return {boolean} - True if the objects are equal, false otherwise
 */
function compareObjects(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every(
    (k) => Object.prototype.hasOwnProperty.call(obj2, k) && obj1[k] === obj2[k]
  );
}

/**
 * Checks if the source object is empty.
 * Returns true if the object contains no enumerable own properties, false otherwise.
 *
 * @param {Object} obj - The object to check
 * @return {boolean} - True if the object is empty, false otherwise
 */
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Makes the source object immutable by preventing any changes to its properties.
 *
 * @param {Object} obj - The source object to make immutable
 * @return {Object} - The immutable version of the object
 */
function makeImmutable(obj) {
  return Object.freeze(obj);
}

/**
 * Returns a word from letters whose positions are provided as an object.
 *
 * @param {Object} lettersObject - An object where keys are letters and values are arrays of positions
 * @return {string} - The constructed word
 */
function makeWord(lettersObject) {
  const pairs = [];

  Object.entries(lettersObject).forEach(([ch, positions]) => {
    positions.forEach((pos) => {
      pairs.push([pos, ch]);
    });
  });

  pairs.sort((a, b) => a[0] - b[0]);
  return pairs.map((p) => p[1]).join('');
}

/**
 * There is a queue for tickets to a popular movie.
 * The ticket seller sells one ticket at a time strictly in order and give the change.
 * The ticket costs 25. Customers pay with bills of 25, 50, or 100.
 * Initially the seller has no money for change.
 * Return true if the seller can sell tickets, false otherwise
 *
 * @param {number[]} queue - The array representing the bills each customer pays with
 * @return {boolean} - True if the seller can sell tickets to everyone, false otherwise
 */
function sellTickets(queue) {
  let bill25 = 0;
  let bill50 = 0;

  for (let i = 0; i < queue.length; i += 1) {
    const bill = queue[i];

    if (bill === 25) {
      bill25 += 1;
    } else if (bill === 50) {
      if (bill25 === 0) return false;
      bill25 -= 1;
      bill50 += 1;
    } else if (bill === 100) {
      if (bill50 > 0 && bill25 > 0) {
        bill50 -= 1;
        bill25 -= 1;
      } else if (bill25 >= 3) {
        bill25 -= 3;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  return true;
}

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 */

function Rectangle(width, height) {
  this.width = width;
  this.height = height;

  this.getArea = function getArea() {
    return this.width * this.height;
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {Object} obj
 * @return {string}
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {Object}
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}

/**
 * Sorts the specified array by country name first and city name
 * (if countries are equal) in ascending order.
 *
 * @param {Array<{country: string, city: string}>} arr
 * @return {Array<{country: string, city: string}>}
 */
function sortCitiesArray(arr) {
  return arr.sort((a, b) => {
    if (a.country < b.country) return -1;
    if (a.country > b.country) return 1;
    if (a.city < b.city) return -1;
    if (a.city > b.city) return 1;
    return 0;
  });
}

/**
 * Groups elements of the specified array by key.
 * Returns multimap of keys extracted from array elements via keySelector callback
 * and values extracted via valueSelector callback.
 *
 * @param {Array<any>} array
 * @param {(item:any)=>string} keySelector
 * @param {(item:any)=>any} valueSelector
 * @return {Map<string, any[]>}
 */
function group(array, keySelector, valueSelector) {
  const map = new Map();

  array.forEach((item) => {
    const key = keySelector(item);
    const value = valueSelector(item);

    if (!map.has(key)) map.set(key, []);
    map.get(key).push(value);
  });

  return map;
}

/* ============================== cssSelectorBuilder ============================== */

const ORDER_ERROR =
  'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
const DUPLICATE_ERROR =
  'Element, id and pseudo-element should not occur more than one time inside the selector';

const PART_ORDER = {
  element: 0,
  id: 1,
  class: 2,
  attr: 3,
  pseudoClass: 4,
  pseudoElement: 5,
};

function buildToken(type, value) {
  if (type === 'element') return `${value}`;
  if (type === 'id') return `#${value}`;
  if (type === 'class') return `.${value}`;
  if (type === 'attr') return `[${value}]`;
  if (type === 'pseudoClass') return `:${value}`;
  return `::${value}`; // pseudoElement
}

function cloneUsed(used) {
  return {
    element: used.element,
    id: used.id,
    pseudoElement: used.pseudoElement,
  };
}

function createSelector(state) {
  const selectorState = state;

  function addPart(type, value) {
    const order = PART_ORDER[type];

    if (order < selectorState.lastOrder) {
      throw new Error(ORDER_ERROR);
    }

    if (
      (type === 'element' && selectorState.used.element) ||
      (type === 'id' && selectorState.used.id) ||
      (type === 'pseudoElement' && selectorState.used.pseudoElement)
    ) {
      throw new Error(DUPLICATE_ERROR);
    }

    const nextUsed = cloneUsed(selectorState.used);
    if (type === 'element') nextUsed.element = true;
    if (type === 'id') nextUsed.id = true;
    if (type === 'pseudoElement') nextUsed.pseudoElement = true;

    const token = buildToken(type, value);

    return createSelector({
      parts: selectorState.parts.concat(token),
      lastOrder: order,
      used: nextUsed,
    });
  }

  return {
    element(value) {
      return addPart('element', value);
    },
    id(value) {
      return addPart('id', value);
    },
    class(value) {
      return addPart('class', value);
    },
    attr(value) {
      return addPart('attr', value);
    },
    pseudoClass(value) {
      return addPart('pseudoClass', value);
    },
    pseudoElement(value) {
      return addPart('pseudoElement', value);
    },
    stringify() {
      return selectorState.parts.join('');
    },
  };
}

function createCombinedSelector(selector1, combinator, selector2) {
  return {
    stringify() {
      return `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    },
  };
}

const cssSelectorBuilder = {
  element(value) {
    return createSelector({
      parts: [],
      lastOrder: -1,
      used: { element: false, id: false, pseudoElement: false },
    }).element(value);
  },

  id(value) {
    return createSelector({
      parts: [],
      lastOrder: -1,
      used: { element: false, id: false, pseudoElement: false },
    }).id(value);
  },

  class(value) {
    return createSelector({
      parts: [],
      lastOrder: -1,
      used: { element: false, id: false, pseudoElement: false },
    }).class(value);
  },

  attr(value) {
    return createSelector({
      parts: [],
      lastOrder: -1,
      used: { element: false, id: false, pseudoElement: false },
    }).attr(value);
  },

  pseudoClass(value) {
    return createSelector({
      parts: [],
      lastOrder: -1,
      used: { element: false, id: false, pseudoElement: false },
    }).pseudoClass(value);
  },

  pseudoElement(value) {
    return createSelector({
      parts: [],
      lastOrder: -1,
      used: { element: false, id: false, pseudoElement: false },
    }).pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return createCombinedSelector(selector1, combinator, selector2);
  },
};

module.exports = {
  shallowCopy,
  mergeObjects,
  removeProperties,
  compareObjects,
  isEmptyObject,
  makeImmutable,
  makeWord,
  sellTickets,
  Rectangle,
  getJSON,
  fromJSON,
  group,
  sortCitiesArray,
  cssSelectorBuilder,
};
