



var promise = new Promise(function (fulfill, reject) {
    fulfill("gently to the sea");
});

function success(arg) {
    var prom = new Promise(function (fulfill, reject) {
        reject("rejection");
    });
    return prom;
}

function err(arg) {
    console.log("error", arg);
}

//promise.then(success, err).then(success, err);