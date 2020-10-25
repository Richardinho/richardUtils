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

  function arrayPush(array, value) {
    return [...array, value];
  }

  function arraySplice(array, index) {
    return array.filter((_, i) => {
      return index !== i; 
    });
  }

  return {
    arraySplice: arraySplice,
    arrayPush: arrayPush,
  };
}));


