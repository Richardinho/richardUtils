## What is a promise?

## How do they work?

A promise has a state in which it maintains the following values:
* whether or not its pending
* whether or not its been fulfilled or rejected
* its value
* the reason for rejection if applicable
* a queue of handlers to run when the promise is fulfilled
* a queue of handlers to run when the promise is rejected


The `then()` method returns a promise.
This allows handlers to be registered with the promise to run when it is either fulfilled or rejected.
The method also returns a new promise itself.
This is resolved depending on the return value from the afore mentioned handlers.
If no appropriate handler exists, then the new promise simply takes the value of the "parent" promise.
In this way, the value of a promise propagates down through the chain of thenables until it finds
a handler. Normally there is an onfulfilled handler. More often, this is useful for catching errors only at once point in the chain.

If onFulfilled returns a value, the promise will be resolved with this value. If it returns a promise or something equivalent to a promise (a promise from another library or some other thenable), the the promise will be resolved with that promise or thenable when it is fulfilled.

The constructor of  Promise is responsible for calling the function that is passed to it, here called the *initial function*, which performs whatever asynchronous actions are required. To this function, the promise passes two callbacks: `fulfil` and `reject`. The initial function calls these according to whether it wants to signal that the process being carried out has succeeded or failed.

Oddly, this behaviour is not described in the specification.

### fulfil function
Regardless of how many times the fulfill function is called, it can only set the state of the promise once. At this point it passes from being in a *pending* state to being in either a *fulfilled* or *rejected* state.Once it goes to one, it can't return to a pending state, nor can the value of the promise be changed after being set.
The fulfil function is also responsible for iterating through the fulfilledQueue and calling all the handlers within.

Question: What if you call then() on a function after it has been fulfilled?



The `then` function creates a new Promise and returns it. This promise is resolved by the result returned from calling
either the onFufilled or the onRejected handlers

if the promise is already resolved, either the `onFulfilled` or the `onRejected` handler is called

When the promise if fufilled, it goes from pending: true to pending: false. It gets a value, and its state is set to *fulfilled*
When the promise if fulfilled, all the handlers in the fulfilledQueue are called


</p>


Promises
Investigate:
* motivation for promises
* How promises work
* history of promises
* future of promises
* well known or important implementations
* make my promises library pass A++ tests

[article here](https://stackoverflow.com/questions/45285129/any-difference-between-await-promise-all-and-multiple-await)
* common things that can be done with promises
* common libraries for promises
* extensions to promises

## Motivation for Promises
promises are a construct that make it easier to write code that calls asynchronous functions.

Typical uses cases

* Making Ajax calls
* setTimeout
* AddEventListener

### Ajax Calls
Wrapped function call
```
  const promise = new Promise((resolve, reject) => {
    const url = 'myurl.html';
    var xhr = new XMLHttpRequest();
    xhr.on("load", resolve);
    xhr.on("error", reject);
    xhr.open("GET", url, true);
    xhr.send(null);
  });

  promise.then(responseHandler, errorHandler);

```

function returning a promise
```
fetch('myurl.html').then(handleResponse);
```

Using async function
```
  const response = await fetch('myurl.html');
  handleResonse(response);
```

```

```
Using async function (not currently implemented)
```
setTimeout(1000).then(handleTimeout);
```

```
  // from within an async function

  await setTimeout(1000);
  handleTimeout();
```

```
const promise = new Promise((resolve, reject) => {

  function handler () {
    resolve();
    disable();
  }

  function disable() {
    element.removeEventListener('click', handler);
  }

  element.addEventListener('click', handler);

  const id = setTimeout(() => {
    reject();
    disable();
  }, 4000);
});

promise.then(() => {
  // do stuff here in response to clicking on element
}, () => {
  // do stuff here in response to button not being clicked
});

```




## Future of Promises
It is claimed that Promises.all() can only be done with promises


