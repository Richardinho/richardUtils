describe('when promise and x are the same object', () => {

  it('should reject with TypeError', () => {
    let promise = {
      reject() {

      }
    };
    let x = promise;
    let spyOnReject = spyOn(promise, 'reject');

    MyPromise.resolve(promise, x);

    expect(spyOnReject).toHaveBeenCalledWith(new TypeError('promise and x refer to same object'));
  });
});

describe('when x is not an object, a function , or a promise', () => {
  it('should fulfill promise with x', () => {
    const promise = new MyPromise();
    const x = 'hello'
    const spyOnPromiseFulfill = spyOn(promise, 'fulfill');

    MyPromise.resolve(promise, x);

    expect(spyOnPromiseFulfill).toHaveBeenCalledWith('hello');
  });
});

fdescribe('', () => {

  it('should..', (done) => {
    const fulfilled = [
      function foo(value) {
        return {
          then: function (onFulfilled) {
            onFulfilled(value);
          }
        };
      },

      function bar(value) {
        const promise = new MyPromise();
        promise.fulfill(value);
        return promise;
      },
    ];

    var dummy = { dummy: "dummy" }; // we fulfill or reject with this when we don't intend to test against it
    var sentinel = { sentinel: "sentinel" }; // a sentinel fulfillment value to test for with strict equality

    var outerThenableFactory = fulfilled[1];
    var innerThenableFactory = fulfilled[0];

    function yFactory() {
      return outerThenableFactory(innerThenableFactory(sentinel));
    }

    function xFactory() {
      return {
        then: function (resolvePromise) {
          resolvePromise(yFactory());
        }
      };
    }
    const resolved = new MyPromise();
    resolved.fulfill(dummy);

    var promise = resolved.then(function() {
      return xFactory();
    });

    promise.then(function(value) {
      expect(value).toBe(sentinel);
      done();
    });

  });
});
