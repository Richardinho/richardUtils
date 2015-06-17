var Promise = require('./promises-promises.js');

module.exports = {


    resolved : function (value) {

        return new Promise(function(fulfil, reject) {
            fulfil("fulfilled");
        });

    },
    rejected : function (reason) {

        return new Promise(function (fulfil, reject) {
            reject("a reason");
        });
    },

    deferred : function() {

        var promise = new Promise();

        return {

            resolve : function(value) {
                promise.fulfil(value);
            },
            reject : function (reason) {
                promise.reject(reason);
            },

            promise : promise
        };
    }
};

/*

 resolved(value): creates a promise that is resolved with value.
 rejected(reason): creates a promise that is already rejected with reason.
 deferred(): creates an object consisting of { promise, resolve, reject }:
 promise is a promise that is currently in the pending state.
 resolve(value) resolves the promise with value.
 reject(reason) moves the promise from the pending state to the rejected state, with rejection reason reason.
*/
