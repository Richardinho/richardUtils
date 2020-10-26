(function (root, factory) {
  'use strict';

	if (typeof define === 'function' && define.amd) {
		define(['../sundry'], function (sundry) {
			return factory(sundry);
		});
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory(require('../sundry'));
	} else {
		root.MyPromise = factory(window.sundry);
	}
}(this, function (sundry) {
  'use strict';

  /*
   *  constants
   */

  var PENDING = 'pending';
  var FULFILLED = 'fulfilled';
  var REJECTED = 'rejected';


  /*
   * Utility functions
   */

  var isFunction = sundry.isFunction;
  var isObject = sundry.isObject;

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

    var that = this;

    if (fn) {
        fn(function (value) {
            Promise.resolve(that, value);
        }, function (reason) {
            that.reject(reason);
        });
    }
  }

  Promise.prototype.fulfill = function (value) {
    this.transition(FULFILLED, value);
    this.processQueueWhenFulfilled();
  };

  Promise.prototype.reject = function (reason) {
    this.transition(REJECTED, reason);
    this.processQueueWhenRejected();
  };

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
  };

  Promise.prototype.processQueueWhenFulfilled = function () {
    var self = this;

    setTimeout(function() {
      while(self.queue.length) {
        var handlers = self.queue.shift();
        var onFulfilled = handlers.onFulfilled;
        var promise = handlers.promise;

        if (isFunction(onFulfilled)) {
          try {
            var x = onFulfilled(self.value);
            Promise.resolve(promise, x);
          } catch(e) {
            promise.reject(e);
          }
        } else {
          promise.fulfill(self.value);
        }
      }
    }, 0);
  };

  Promise.prototype.processQueueWhenRejected = function () {
    var self = this;

    setTimeout(function() {
      while(self.queue.length) {
        var handlers = self.queue.shift();
        var onRejected = handlers.onRejected;
        var promise = handlers.promise;

        if (isFunction(onRejected)) {
          try {
            var x = onRejected(self.reason);
            Promise.resolve(promise, x);
          } catch(e) {
            promise.reject(e);
          }
        } else {
          promise.reject(self.reason);
        }
      }
    }, 0);
  };

  // the onFulfilled function determines how the promise returned from then is resolved
  Promise.prototype.then = function(onFulfilled, onRejected) {
    var promise = new Promise();

    this.queue.push({
      onFulfilled: onFulfilled,
      onRejected: onRejected,
      promise: promise,
    });

    if (this.state === FULFILLED) {
      this.processQueueWhenFulfilled();
    }

    if (this.state === REJECTED) {
      this.processQueueWhenRejected();
    }

    return promise;
  };

  Promise.resolve = function(promise, x) {
    if (x === promise) {
      promise.reject(new TypeError("promise and x refer to same object"));
    } else if (isPromise(x)) {
      if (x.state === PENDING) {
        x.then(
          function (val){
            promise.fulfill(val);
          },

          function(reason){
            promise.reject(reason);
          });
      } else if(x.state === REJECTED) {
        promise.reject(x.reason);
      } else if (x.state === FULFILLED) {
        promise.fulfill(x.value);
      }
    } else if (isObject(x) || isFunction(x)) {
      var allowCall = true;

      var resolvePromise = function resolvePromise(y) {
        if (allowCall) {
          allowCall = false;
          Promise.resolve(promise, y);
        }
      };

      var rejectPromise = function rejectPromise(r) {
        if (allowCall) {
          allowCall = false;
          promise.reject(r);
        }
      };

      try {
        var then = x.then;

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
  }; 

  return Promise;
}));
