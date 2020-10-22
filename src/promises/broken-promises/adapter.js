var TestPromise = require('./promise');

exports.resolved = function (value) {
  'use strict';
  var promise = new TestPromise();
  promise.fulfill(value);
  return promise;
};

exports.rejected = function(reason) {
  'use strict';
  var promise = new TestPromise();
  promise.reject(reason);
  return promise;
};

exports.deferred = function() {
  'use strict';

  var promise = new TestPromise();

  function resolve(value) {
    promise.fulfill(value);
  }

  function reject(reason) {
    promise.reject(reason);
  }

  return {
    promise: promise,
    resolve: resolve,
    reject: reject,
  };
};


