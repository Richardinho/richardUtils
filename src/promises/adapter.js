var TestPromise = require('./index.js');

exports.resolved = function(value) {
  'use strict';

  var promise = new TestPromise(function(resolve) {
    resolve(value);
  });

  return promise;
};

exports.rejected = function(reason) {
  'use strict';

  var promise = new TestPromise(function(_, reject) {
    reject(reason);
  });

  return promise;
};

exports.deferred = function() {
  'use strict';

  var resolve, reject;

  var promise = new TestPromise(function(_resolve, _reject) {
    resolve = _resolve;
    reject = _reject;
  });

  return {
    promise: promise,
    resolve: resolve,
    reject: reject,
  };
};


