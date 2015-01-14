    var Promise = require('./Promise.js');

    "use strict";

    var promise;

    function fulfilled(num) {
        return function() {
            console.log("#%s: fulfilled:", num, arguments);
        }
    }

    function rejected(num) {
        return function() {
            console.log("#%s: rejected:", num, arguments);
        }
    }

    //  1. Resolving a promise

    promise = new Promise(function(fulfil, reject){
        setTimeout(fulfil, 1000, "apple");
    });

    promise.then(fulfilled(1), rejected(1));

    //  2. Rejecting a promise

    promise = new Promise(function(fulfil, reject){
        setTimeout(reject, 1000, "banana");
    });

    promise.then(fulfilled(2), rejected(2));

    // 3. Resolving a synchronous promise

    promise = new Promise(function(fulfil, reject) {
        fulfil("carrot");
    });
    promise.then(fulfilled(3), rejected(3));

    // 4. Rejecting a synchronous promise

    promise = new Promise(function(fulfil, reject) {
        reject("pineaple");
    });
    promise.then(fulfilled(4), rejected(4));

    //  5. Chaining async fulfilled promises

    promise = new Promise(function (fulfil) {
        setTimeout(function () {
            fulfil("coca cola");
        }, 10);
    });
    promise.then(function() {
        var args = arguments[0];
        var prom = new Promise(function (fulfil) {
            setTimeout(function () {
                fulfil(args + "pepsi cola");
            });
        });
        return prom;

    }).then(fulfilled(5), rejected(5));

    //  6.  chaining async rejected promises
    promise = new Promise(function (fulfil, reject) {
        setTimeout(function () {
            reject("aberdeen");
        }, 10000);
    });

    function foo() {
        var prom = new Promise();
        prom.fulfil("foo fulfilled", arguments);
        return prom;
    }
    function bar() {
        var prom = new Promise();
        prom.fulfil("bar fulfille", arguments);
        return prom;
    }
    function complete() {
        console.log("complete", arguments);
    }
    function handleErrors() {
        console.log("handle errors", arguments);
    }
    promise.then(foo)
           .then(bar)
           .then(complete, handleErrors)




