const TestPromise = require('./promise');

exports.resolved = (value) => {
  const promise = new TestPromise();
  promise.fulfill(value);
  return promise;
}

exports.rejected = (reason) => {
  const promise = new TestPromise();
  promise.reject(reason);
  return promise;
}

exports.deferred = () => {

  const promise = new TestPromise();

  function resolve(value) {
    promise.fulfill(value);
  }

  function reject(reason) {
    promise.reject(reason);
  }

  return {
    promise,
    resolve,
    reject,
  };
};


