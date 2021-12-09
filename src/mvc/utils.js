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

  function arraySplice(array, index) {
    return array.filter(function(_, i) {
      return index !== i; 
    });
  }

  return {
    arraySplice: arraySplice,
    arrayPush: arrayPush,
  };
}));


