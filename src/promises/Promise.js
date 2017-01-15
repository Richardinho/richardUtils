(function (root, factory) {

    'use strict';

	if (typeof define === 'function' && define.amd) {
		define(['../sundry'], function () {
			return factory(sundry);
		});
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory(require('../sundry'));
	} else {

		root.PromisesPromises = factory(window.sundry);
	}
}(this, function (utils) {

    "use strict";
    /**
     * Creates am A+ compliant Promise
     * @class
     * @alias PromisesPromise
     * @author  Richard Hunter <richard@richardhunter.co.uk>
     */
    function Promise(init) {

        this.fulfilledQueue = [];
        this.rejectedQueue = [];

        this.state = {
            pending: true,
            fulfilled: false,
            rejected: false,
            value: null,
            reason: null
        };

        var self = this;

        if (init) { //  give the then method the time to run.
            setTimeout(function() {
                init(self.fulfil.bind(self), self.reject.bind(self));
            }, 0);
        }
    }


    /**
     * fulfil promise
     * @param {object} value - value of promise
     */
    Promise.prototype.fulfil = function (value) {
        var self = this;

        if (self.state.pending) {
            self.state.pending = false;
            self.state.value = value;
            self.state.fulfilled = true;
            //  go through queue of fulfilled functions
            self.fulfilledQueue.forEach(function (onFulfilled) {
                onFulfilled.call(self);
            });

        }
    };
    /**
     * reject the promise
     * @param {string}  reason - reason for rejection
     */
    Promise.prototype.reject = function (reason) {

        var self = this;

        if (self.state.pending) {
            self.state.pending = false;
            self.state.reason = reason;
            self.state.rejected = true;

            self.rejectedQueue.forEach(function (onRejection) {
                onRejection.call(self);
            });
        }
    };

    /**
     * returns true if argument is a promise
     * @param {any}  candidate promise
     * @returns {Boolean}
     */
    Promise.isPromise = function (obj) {

        return obj instanceof Promise;
    };

    /**
     * Carries out resolve procedure.
     * @param {Promise}  promise - promise to be resolved
     * @param {any}  x - object to resolve promise with
     */
    Promise.resolve = function (promise, x) {

        if (x === promise) {
            promise.reject(new TypeError("promise and x refer to same object"));
            return;
        }
        //  If x is a promise, adopt its state [3.4]:
        //  If x is pending, promise must remain pending until x is fulfilled or rejected.
        //  If/when x is fulfilled, fulfill promise with the same value.
        //  If/when x is rejected, reject promise with the same reason.
        if (Promise.isPromise(x)) {
            promise.state = x.state;
            return;
        }
        var resolveRejectCalled = false;
        //  If both resolvePromise and rejectPromise are called, or multiple calls to the same argument
        //  are made, the first call takes precedence, and any further calls are ignored.
        function resolvePromise(y) {
            if(!resolveRejectCalled) {
                //  If/when resolvePromise is called with a value y, run [[Resolve]](promise, y).
                Promise.resolve(promise, y);
                resolveRejectCalled = true;
            }
        }

        function rejectPromise(r) {
            if(!resolveRejectCalled) {
                //  If/when rejectPromise is called with a reason r, reject promise with r.
                promise.reject(r);
                resolveRejectCalled = true;
            }
        }

        if (utils.isObject(x)) {
            var then = x.then;
            //  If calling then throws an exception e,
            try {
                then.call(x, resolvePromise, rejectPromise);
            } catch(e) {
                //  If resolvePromise or rejectPromise have been called, ignore it.
                if(!resolveRejectCalled ) {
                    //  Otherwise, reject promise with e as the reason.
                    promise.reject(e);
                }
            }

        } else {
            promise.fulfil(x);
        }
    };

    /**
     * @public
     * @param {Function} onFulfilled - success callback
     * @param {Function} onRejected - failure callback
     * @returns {Promise} returns a new promise
     */
    Promise.prototype.then = function (onFulfilled, onRejected) {

        //  Both onFulfilled and onRejected are optional arguments:

        var promise2 = new Promise();

        //  If onFulfilled is a function:
        //  it must be called after promise is fulfilled, with promise's value as its first argument.
        //  it must not be called before promise is fulfilled.
        //it must not be called more than once.
        this.fulfilledQueue.push(function () {

            var x;

            if (utils.isFunction(onFulfilled)) {
                //onFulfilled must be called as a function (i.e. with no this value)
                //If onFulfilled throws an exception e, promise2 must be rejected with e as the reason.
                try {
                    x = onFulfilled(this.state.value);
                } catch (e) {
                    promise2.reject(e);
                }
                if (x) {
                    Promise.resolve(promise2, x);
                }
            } else {
                //If onFulfilled is not a function and promise1 is fulfilled, promise2 must be fulfilled with the same value as promise1.
                promise2.fulfil(this.state.value);
            }
        });

        this.rejectedQueue.push(function () {
            //  If onRejected is a function,
            //  it must be called after promise is rejected, with promise's reason as its first argument.
            //  it must not be called before promise is rejected.
            //  it must not be called more than once.

            var x;

            if (utils.isFunction(onRejected)) {
                //  onRejected must be called as a function (i.e. with no this value)
                //  If onRejected throws an exception e, promise2 must be rejected with e as the reason.
                try {
                    x = onRejected(this.state.reason);
                } catch (e) {
                    promise2.reject(e);
                }
                if (x) {
                    Promise.resolve(promise2, x);
                }
            } else {
                // If onRejected is not a function and promise1 is rejected, promise2 must be rejected with the same reason as promise1.
                promise2.reject(this.state.reason);
            }
        });

        return promise2;
    };

    return Promise;


}));


