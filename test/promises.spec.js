describe('promises', function () {

    var P;

    beforeEach(function () {

        P = window.PromisesPromises;

    });

    /*

        https://promisesaplus.com/

        1. Terminology

        1.1 “promise” is an object or function with a then method whose behavior conforms to this specification.
        1.2 “thenable” is an object or function that defines a then method.
        1.3 “value” is any legal JavaScript value (including undefined, a thenable, or a promise).
        1.4 “exception” is a value that is thrown using the throw statement.
        1.5 “reason” is a value that indicates why a promise was rejected.

        2.1 Promise states

        2.1.1 When pending, a promise:
        2.1.1.1 may transition to either the fulfilled or rejected state.

    */

    describe('promise states', function () {

        describe('When pending, a promise..', function () {

            var pendingPromise;

            beforeEach(function () {

                pendingPromise = new P();

            });


            describe('onFulfil()', function () {
                it('should transition to fulfilled state with value', function () {

                    expect(pendingPromise.state.pending).toBe(true);
                    expect(pendingPromise.state.fulfilled).toBe(false);
                    expect(pendingPromise.state.value).toBeFalsy();
                    pendingPromise.fulfil('orange');
                    expect(pendingPromise.state.pending).toBe(false);
                    expect(pendingPromise.state.fulfilled).toBe(true);
                    expect(pendingPromise.state.value).toBe('orange');
                });
            });

            describe('onReject()', function () {
                it('should transition to rejected state with reason', function () {

                    expect(pendingPromise.state.pending).toBe(true);
                    expect(pendingPromise.state.rejected).toBe(false);
                    expect(pendingPromise.state.reason).toBeFalsy();
                    pendingPromise.reject('some reason');
                    expect(pendingPromise.state.pending).toBe(false);
                    expect(pendingPromise.state.rejected).toBe(true);
                    expect(pendingPromise.state.reason).toBe('some reason');
                });
            });
        });


        /*
            2.1.2 When fulfilled, a promise:
            2.1.2.1 must not transition to any other state.
            2.1.2.2 must have a value, which must not change.
        */

        describe('When fulfilled, a promise..', function () {

            var fulfilledPromise;

            beforeEach(function () {

                fulfilledPromise = new P();
                fulfilledPromise.fulfil('banana');

            });

            it('must NOT transition to any other state', function () {

                expect(fulfilledPromise.state.fulfilled).toBe(true);
                expect(fulfilledPromise.state.value).toBe('banana');
                fulfilledPromise.reject('some reason');
                expect(fulfilledPromise.state.rejected).toBe(false);
                expect(fulfilledPromise.state.fulfilled).toBe(true);
                expect(fulfilledPromise.state.value).toBe('banana');

            });

            it('must have a value, which must NOT change', function () {

                expect(fulfilledPromise.state.fulfilled).toBe(true);
                expect(fulfilledPromise.state.value).toBe('banana');
                fulfilledPromise.fulfil('orange');
                expect(fulfilledPromise.state.fulfilled).toBe(true);
                expect(fulfilledPromise.state.value).toBe('banana');

            });
        });

        /*

            2.1.3 When rejected, a promise:
            2.1.3.1 must not transition to any other state.
            2.1.3.2 must have a reason, which must not change.

        */

        describe('When rejected, a promise..', function () {

            var rejectedPromise;

            beforeEach(function () {

                rejectedPromise = new P();
                rejectedPromise.reject('some reason');

            });

            it('must NOT transition to any other state', function () {

                expect(rejectedPromise.state.rejected).toBe(true);
                expect(rejectedPromise.state.reason).toBe('some reason');
                rejectedPromise.fulfil('pineapple');
                expect(rejectedPromise.state.rejected).toBe(true);
                expect(rejectedPromise.state.fulfilled).toBe(false);
                expect(rejectedPromise.state.reason).toBe('some reason');

            });

            it('must have a reason, which must not change', function () {

                expect(rejectedPromise.state.rejected).toBe(true);
                expect(rejectedPromise.state.reason).toBe('some reason');
                rejectedPromise.reject('another reason');
                expect(rejectedPromise.state.rejected).toBe(true);
                expect(rejectedPromise.state.reason).toBe('some reason');

            });
        });
    });


    /*
        2.2 The then Method

        A promise must provide a then method to access its current or eventual value or reason.
        A promise’s then method accepts two arguments:

            promise.then(onFulfilled, onRejected)

        2.2.1 Both onFulfilled and onRejected are optional arguments:
        2.2.1.1 If onFulfilled is not a function, it must be ignored.
        2.2.1.2 If onRejected is not a function, it must be ignored.

    */


    /*
        2.2.2 If onFulfilled is a function:
        2.2.2.1 it must be called after promise is fulfilled, with promise’s value as its first argument.
        2.2.2.2 it must not be called before promise is fulfilled.
        2.2.2.3 it must not be called more than once.

    */

    describe('when onFulfilled is a function', function () {

        var p,
            onFulfilled;

        beforeEach(function () {

            onFulfilled = jasmine.createSpy('spy-on-on-fulfilled');
            p = new P();
            p.then(onFulfilled);
        });

        it('must be called after promise is fulfilled, with promise’s value as its first argument', function () {

            expect(onFulfilled).not.toHaveBeenCalled();
            p.fulfil('lettuce');
            expect(onFulfilled).toHaveBeenCalledWith('lettuce');
        });

        it('it must not be called more than once', function () {

            expect(onFulfilled).not.toHaveBeenCalled();
            p.fulfil('lettuce');
            p.fulfil('broccoli');
            expect(onFulfilled).toHaveBeenCalledTimes(1);
        });
    });

    /*
        2.2.3 If onRejected is a function,
        2.2.3.1 it must be called after promise is rejected, with promise’s reason as its first argument.
        2.2.3.2 it must not be called before promise is rejected.
        2.2.3.3 it must not be called more than once.

    */


    describe('when onRejected is a function', function () {

        var p,
            onRejected;

        beforeEach(function () {

            onRejected = jasmine.createSpy('spy-on-on-rejected');
            p = new P();
            p.then(null, onRejected);
        });

        it('it must be called after promise is rejected, with promise’s reason as its first argument.', function () {

            expect(onRejected).not.toHaveBeenCalled();
            p.reject('some reason');
            expect(onRejected).toHaveBeenCalledWith('some reason');
        });

        it('it must not be called more than once', function () {

            expect(onRejected).not.toHaveBeenCalled();
            p.reject('some reason');
            p.reject('anotherreason');
            expect(onRejected).toHaveBeenCalledTimes(1);
        });
    });


    /*

        2.2.6 then may be called multiple times on the same promise.
        2.2.6.1 If/when promise is fulfilled, all respective onFulfilled callbacks must execute in the order of their originating calls to then.
        2.2.6.2 If/when promise is rejected, all respective onRejected callbacks must execute in the order of their originating calls to then.

    */

    describe('when then is called multiple times on the same promise', function () {
        describe('when promise if fulfilled', function () {
            var p,
                onFulfilled1,
                onFulfilled2,
                onFulfilled3,
                onFulfilledTracker1,
                onFulfilledTracker2,
                onFulfilledTracker3;

            beforeEach(function () {

                var counter = 0;

                onFulfilled1 = function () { counter++; onFulfilledTracker1 = counter; };
                onFulfilled2 = function () { counter++; onFulfilledTracker2 = counter; };
                onFulfilled3 = function () { counter++; onFulfilledTracker3 = counter; };

                p = new P();

                p.then(onFulfilled1);
                p.then(onFulfilled2);
                p.then(onFulfilled3);

                p.fulfil('blah');

            });

            it('should call onFulfilled callbacks in order', function () {

                expect(onFulfilledTracker1).toBe(1);
                expect(onFulfilledTracker2).toBe(2);
                expect(onFulfilledTracker3).toBe(3);
            });
        });
        describe('when promise if rejected', function () {

            var p,
                onRejected1,
                onRejected2,
                onRejected3,
                onRejectedTracker1,
                onRejectedTracker2,
                onRejectedTracker3;

            beforeEach(function () {

                var counter = 0;

                onRejected1 = function () { counter++; onRejectedTracker1 = counter; };
                onRejected2 = function () { counter++; onRejectedTracker2 = counter; };
                onRejected3 = function () { counter++; onRejectedTracker3 = counter; };

                p = new P();

                p.then(null, onRejected1);
                p.then(null, onRejected2);
                p.then(null, onRejected3);

                p.reject('some reason');

            });

            it('should call onRejected callbacks in order', function () {

                expect(onRejectedTracker1).toBe(1);
                expect(onRejectedTracker2).toBe(2);
                expect(onRejectedTracker3).toBe(3);
            });
        });
    });

    /*

        2.2.7 then must return a promise [3.3].

        Implementations may allow promise2 === promise1, provided the implementation meets all requirements. Each implementation should document whether it can produce promise2 === promise1 and under what conditions.
    */

    describe('then must return a promise', function () {

        var p,
            result;

        beforeEach(function () {

            p = new P();
            result = p.then();
        });

        it('should return a promise', function () {

            expect(P.isPromise(result)).toBe(true);
        });
    });

    /*

        2.3 The Promise Resolution Procedure

        2.3.1 If promise and x refer to the same object, reject promise with a TypeError as the reason.

    */

    describe('Promise resolution', function () {

        var promise,
            x,
            spyOnReject;

        describe('when promise and x refer to the same object', function () {

            beforeEach(function () {
                promise = new P();
                spyOnReject = spyOn(promise, 'reject').and.callThrough();
                x = promise;

                P.resolve(promise, x);
            });

            it('should call reject() on promise setting TypeError as reason', function () {
                expect(spyOnReject).toHaveBeenCalled();
                expect(promise.state.reason instanceof TypeError).toBe(true);
            });
        });

        /*
            2.3.2 If x is a promise, adopt its state [3.4]:
            2.3.2.1 If x is pending, promise must remain pending until x is fulfilled or rejected.
            2.3.2.2 If/when x is fulfilled, fulfill promise with the same value.
            2.3.2.3 If/when x is rejected, reject promise with the same reason.

        */
        describe('when x is a promise', function () {
            beforeEach(function () {
                promise = new P();
                x = new P();
                P.resolve(promise, x);
            });
            describe('when x is pending', function () {
                it('promise should be pending', function () {

                    expect(x.state.pending).toBe(true);
                    expect(promise.state.pending).toBe(true);
                    /*
                        Because promise and x share same state object, when x
                        updates its state, promise will automatically get x's.
                    */
                    expect(promise.state).toBe(x.state);
                });
                describe('when x is fulfilled', function () {
                    beforeEach(function () {

                        x.fulfil('carrot');
                    });
                    it('should fulfill promise with same value as x', function () {

                        expect(promise.state.fulfilled).toBe(true);
                        expect(promise.state.value).toBe('carrot');

                    });
                });
                describe('when x is rejected', function () {
                    beforeEach(function () {
                        x.reject('some reason');
                    });
                    it('should reject promise with same reason as x', function () {

                        expect(promise.state.rejected).toBe(true);
                        expect(promise.state.reason).toBe('some reason');

                    });
                });
            });
        });
        /*

2.3.3  Otherwise, if x is an object or function,
   2.3.3.1  Let then be x.then. [3.5]
   2.3.3.2 If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.
   2.3.3.3  If then is a function, call it with x as this, first argument resolvePromise, and second argument rejectPromise, where:
      2.3.3.3.1  If/when resolvePromise is called with a value y, run [[Resolve]](promise, y).
      2.3.3.3.2  If/when rejectPromise is called with a reason r, reject promise with r.
      2.3.3.3.3  If both resolvePromise and rejectPromise are called, or multiple calls to the same argument are made, the first call takes precedence, and any further calls are ignored.
      2.3.3.3.4  If calling then throws an exception e,
         2.3.3.3.4.1  If resolvePromise or rejectPromise have been called, ignore it.
         2.3.3.3.4.2 Otherwise, reject promise with e as the reason.
   2.3.3.4 If then is not a function, fulfill promise with x.

        */

        describe('if then is a function', function () {

            var resolvePromise,
                rejectPromise,
                spyOnPromiseResolve,
                spyOnPromiseReject;

            beforeEach(function () {

                promise = new P();
            });

            describe('when then is called with x as this, first argument resolvePromise, and second argument rejectPromise', function () {

                beforeEach(function () {

                    x = {
                        then : function (resolve, reject) {
                           resolvePromise = resolve;
                           rejectPromise = reject;
                        }
                    };

                    P.resolve(promise, x);

                    spyOnPromiseResolve = spyOn(P, 'resolve');
                    spyOnPromiseReject = spyOn(promise, 'reject');
                });

                it('should run [[Resolve]](promise, y)', function () {

                    resolvePromise('cauliflower');
                    expect(spyOnPromiseResolve).toHaveBeenCalledWith(promise, 'cauliflower');
                });

                it('should reject promise with reason', function () {

                    rejectPromise('a reason');
                    expect(spyOnPromiseReject).toHaveBeenCalledWith('a reason');

                });

                describe('when both resolvePromise and rejectPromise are called', function () {
                    describe('when rejectPromise is called first', function () {
                        it('should not resolve promise', function () {

                            rejectPromise('a reason');
                            resolvePromise('cauliflower');
                            expect(spyOnPromiseResolve).not.toHaveBeenCalled();

                        });
                    });
                    describe('when resolvePromise is called first', function () {
                        it('should not reject promise', function () {

                            resolvePromise('cauliflower');
                            rejectPromise('a reason');
                            expect(spyOnPromiseReject).not.toHaveBeenCalled();

                        });
                    });
                });

            });

            describe('when calling then throws an exception e', function () {
                var e;
                beforeEach(function () {

                    e = new Error('an exception');
                    spyOnPromiseReject = spyOn(promise, 'reject');
                });

                describe('When resolvePromise has been called', function () {
                    beforeEach(function () {
                        x = {
                            then : function (resolvePromise, rejectPromise) {
                                resolvePromise();
                                throw e;
                            }
                        }
                        P.resolve(promise, x);
                    });
                    it('should ignore exception', function () {

                        expect(spyOnPromiseReject).not.toHaveBeenCalled();
                    });
                });
                describe('When neither resolvePromise nor rejectPromise have been called', function () {
                    beforeEach(function () {
                        x = {
                            then : function (resolvePromise, rejectPromise) {
                                throw e;
                                resolvePromise(); //  after exception!
                            }
                        }
                        P.resolve(promise, x);

                    });
                    it('should reject promise with e as the reason', function () {

                        expect(spyOnPromiseReject).toHaveBeenCalledWith(e);
                    });
                });
            });
        });

        describe('when then is NOT a function', function () {

            beforeEach(function () {
                promise = new P();

                x = 'blah';
            });

            it('should fulfill promise with x', function () {

                P.resolve(promise, x);

                expect(promise.state.fulfilled).toBe(true);
                expect(promise.state.value).toBe(x);

            });
        });
    });

    //  general smoke test
	describe('when promise resolves', function () {

		var promise, result;

		beforeEach(function (done) {

            promise = new P(function (resolve, reject) {
                setTimeout(function () {
                    resolve('hello world');
                }, 0)
            });

            promise.then(function (data) {
                result = data;
                done();
            });
		});

		it('should push resolved data to callback', function () {
			expect(result).toBe('hello world');
		});
	});

});
