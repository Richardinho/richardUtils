const TestPromise = require('./index.js');

exports.resolved = (value) => {
  const promise = new TestPromise((resolve) => {
    resolve(value);
  });
  return promise;
}

exports.rejected = (reason) => {
  const promise = new TestPromise((_, reject) => {
    reject(reason);
  });

  return promise;
}

exports.deferred = () => {
  var resolve, reject;

  const promise = new TestPromise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  return {
    promise,
    resolve,
    reject,
  };
};


