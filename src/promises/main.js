    var Promise = require('./Promise.js');

    "use strict";


    var promise = new Promise(function(fulfil, reject){
        setTimeout(fulfil, 1000, "apple");

    });

    promise.then(function (arg) {

        var prom = new Promise();
        setTimeout(function() {
            prom.reject("hellellel");
        }, 1000);
        return prom;

    }).then(function() {

        console.log(arguments);
    }, function() {

        console.log("reject", arguments);

    });





