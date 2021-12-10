(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
		define([], function () {
			return factory();
		});
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.utils = factory();
  }
}(this, function () {

  'use strict';

  function arrayPush(array, value) {
    var newArray = array.slice();
    newArray.push(value);
    return newArray;
  }

  return {
    arrayPush: arrayPush,
  };
}));


