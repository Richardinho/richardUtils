(function (root, factory) {
  'use strict';

	if (typeof define === 'function' && define.amd) {
		define([], function () {
			return factory();
		});
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory();
	} else {
		root.MyPromise = factory();
	}
}(this, function () {

  /*
   *  constants
   */

  const PENDING = 'pending';
  const FULFILLED = 'fulfilled';
  const REJECTED = 'rejected';

  /*
   * Utility functions
   */

  function isFunction (val) {
    return val && typeof val === "function";
  }

  function isObject (val) {
    return val && typeof val === "object";
  }

  function isPromise(val) {
    return val instanceof Promise;
  }

  /*
   *  constructor
   */

  function Promise(fn) {
    this.state = PENDING;
    this.value = null;
    this.reason = null;
    this.queue = [];
  }

  Promise.prototype.fulfill = function (value) {
    this.transition(FULFILLED, value);
    this.processQueueWhenFulfilled();
  }

  Promise.prototype.reject = function (reason) {
    this.transition(REJECTED, reason);
    this.processQueueWhenRejected();
  }

  Promise.prototype.transition = function(newState, arg) {
    if (this.state === PENDING) {
      if (newState === FULFILLED) {
        this.value = arg;
      }

      if (newState === REJECTED) {
        this.reason = arg;
      }

      this.state = newState;
    }
  }

  Promise.prototype.processQueueWhenFulfilled = function () {
    setTimeout(() => {
      while(this.queue.length) {
        const {onFulfilled, promise} = this.queue.shift();

        if (isFunction(onFulfilled)) {
          try {
            let x = onFulfilled(this.value);
            Promise.resolve(promise, x);
          } catch(e) {
            promise.reject(e);
          }
        } else {
          promise.fulfill(this.value);
        }
      }
    }, 0);
  }

  Promise.prototype.processQueueWhenRejected = function () {
    setTimeout(() => {
      while(this.queue.length) {
        const {onRejected, promise} = this.queue.shift();

        if (isFunction(onRejected)) {
          try {
            let x = onRejected(this.reason);
            Promise.resolve(promise, x);
          } catch(e) {
            promise.reject(e);
          }
        } else {
          promise.reject(this.reason);
        }
      }
    }, 0);
  }

  // the onFulfilled function determines how the promise returned from then is resolved
  Promise.prototype.then = function(onFulfilled, onRejected) {
    const promise = new Promise();

    this.queue.push({
      onFulfilled,
      onRejected,
      promise,
    });

    if (this.state === FULFILLED) {
      this.processQueueWhenFulfilled();
    }

    if (this.state === REJECTED) {
      this.processQueueWhenRejected();
    }

    return promise;
  }

  Promise.resolve = function(promise, x) {
    if (x === promise) {
      promise.reject(new TypeError("promise and x refer to same object"));
    } else if (isPromise(x)) {
      if (x.state === PENDING) {
        x.then(

          (val) => {
            promise.fulfill(val);
          },

          (reason) => {
            promise.reject(reason);
          });
      } else if(x.state === REJECTED) {
        promise.reject(x.reason);
      } else if (x.state === FULFILLED) {
        promise.fulfill(x.value);
      }
    } else if (isObject(x) || isFunction(x)) {
      let allowCall = true;

      function resolvePromise(y) {
        if (allowCall) {
          allowCall = false;
          Promise.resolve(promise, y);
        }
      }

      function rejectPromise(r) {
        if (allowCall) {
          allowCall = false;
          promise.reject(r);
        }
      }

      try {
        let then = x.then;

        if (isFunction(then)) {
          try {
            then.call(x, resolvePromise, rejectPromise);
          } catch(e) {
            if (allowCall) {
              promise.reject(e);
            }
          }
        } else {
          promise.fulfill(x);
        }
      } catch(e) {
        promise.reject(e);
      }
    } else {
      promise.fulfill(x);
    }
  } 

  return Promise;
}));
