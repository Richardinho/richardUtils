
(function () {
    "use strict";

    function Promise(init) {

        this.state = {
            pending: true,
            fulfilled: false,
            rejected: false,
            value: null,
            reason: null
        };

        if (init) {
            init(this.fulfil.bind(this), this.reject.bind(this));
        }
    }

    Promise.isFunction = function (obj) {
        return typeof obj == 'function' || false;
    };

    Promise.isPromise = function (obj) {
        return obj instanceof this;
    }

    Promise.isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    }

    Promise.prototype.fulfil = function (value) {
        if (this.state.pending) {
            this.state.pending = false;
            this.state.value = value;
            this.state.fulfilled = true;
        }
    };
    Promise.prototype.reject = function (reason) {
        if (this.state.pending) {
            this.state.pending = false;
            this.state.reason = reason;
            this.state.rejected = true;
        }
    };

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

        if (Promise.isObject(x)) {
            var then = x.then;
            //  If calling then throws an exception e,
            try {
                then.call(x, resolvePromise, rejectPromise);
            } catch(e) {
                //  If resolvePromise or rejectPromise have been called, ignore it.
                if(!resolveRejectCalled) {
                    //  Otherwise, reject promise with e as the reason.
                    promise.reject(e);
                }
            }

        } else {
            promise.fulfil(x);
        }
    }

    Promise.prototype.then = function (onFulfilled, onRejected) {

        //  Both onFulfilled and onRejected are optional arguments:
        //  If onFulfilled is not a function, it must be ignored.
        var onFulfilledIsFunction = Promise.isFunction(onFulfilled);
        //  If onRejected is not a function, it must be ignored.
        var onRejectedIsFunction = Promise.isFunction(onRejected);

        var self = this;

        var promise2 = new Promise();

        function pending() {
            var x;
            if (!self.state.pending) {
                //  If onFulfilled is a function:
                //  it must be called after promise is fulfilled, with promise's value as its first argument.
                //  it must not be called before promise is fulfilled.
                //it must not be called more than once.
                if (self.state.fulfilled) {

                    if (onFulfilledIsFunction) {
                        //onFulfilled must be called as a function (i.e. with no this value)
                        //If onFulfilled throws an exception e, promise2 must be rejected with e as the reason.
                        try {
                            x = onFulfilled(self.state.value);
                        } catch (e) {
                            promise2.reject(e);
                        }
                        if (x) {
                            Promise.resolve(promise2, x);
                        }
                    } else {
                        //If onFulfilled is not a function and promise1 is fulfilled, promise2 must be fulfilled with the same value as promise1.
                        promise2.fulfil(self.state.value);
                    }
                }
                //  If onRejected is a function,
                //  it must be called after promise is rejected, with promise's reason as its first argument.
                //  it must not be called before promise is rejected.
                //  it must not be called more than once.
                if (self.state.rejected) {
                    if (onRejectedIsFunction) {
                        //  onRejected must be called as a function (i.e. with no this value)
                        //  If onRejected throws an exception e, promise2 must be rejected with e as the reason.
                        try {
                            x = onRejected(self.state.reason);
                        } catch (e) {
                            promise2.reject(e);
                        }
                        if (x) {
                            Promise.resolve(promise2, x);
                        }
                    } else {
                        // If onRejected is not a function and promise1 is rejected, promise2 must be rejected with the same reason as promise1.
                        promise2.reject(self.state.reason);
                    }

                }
            } else {
                setTimeout(pending, 0);
            }
        };
        //  onFulfilled or onRejected must not be called until the execution context stack contains only platform code.
        setTimeout(pending, 0);

        return promise2;
    }

    if (typeof module === "object" && module && typeof module.exports === "object") {
        // Expose jQuery as module.exports in loaders that implement the Node
        // module pattern (including browserify). Do not create the global, since
        // the user will be storing it themselves locally, and globals are frowned
        // upon in the Node module world.
        module.exports = Promise;
    } else {
        //  create global variable
        if(typeof window === "object") {
            window.PromisesPromise = Promise;
        }
    }

}());


