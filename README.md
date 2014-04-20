
event handling enhanced objects
-------------------------------

This code provides a single function which takes a javascript object, which may have nested objects as properties, and adds event handling methods to it which
enable events to be fired on objects and handlers to be registered that will listen to these events. Events can also be made to propagate both up and down
the object tree allowing, for example, events fired on a leaf node to be listened to by a handler that is registered on the root node.

I propose a use case for this structure to be as a model for an application whereby components can register listeners to those part of the model that they are
concerned with, but also communicate with other parts of the application by firing events on the model. This removes the need
for extra complex event handling code to be written.

#### Usage:

Pass a plain old javacsript object to the `createProxyObj()` function. This returns a proxy object on which you can set and get propeties in exactly the same way as you would with a normal object.


    var pojso = {
        name : "Alice",
        vehicles : {
            cars : { fiesta : "my fiesta", bugatti : "a bugatti"}
        }
    }
    var proxiedObj = createProxyObj(pojso);

    // set a property value
    pojso.vehicles.cars.fiesta = "a new fiesta";

    //  prints out 'a new fiesta'
    console.log(proxiedObj.vehicles.cars.fiesta);

In addition to this, you can register a listener on an object which will be called whenever a property value changes.


    var foo = {
        myHandlerFunction : function () {
            console.log(this.bar);
        },
        bar : "this is bar"
    }
    pojso.on("change", foo.myHandlerFunction, foo);
    pojso.name = "Bob";




`on()` is called on a proxy object and is passed the name of the event to listen to, the handler function that will run when that
event occurs, and a context which will provide the value of 'this' within the handler function. When the above code runs, the text
'this is bar' will be printed to the console. Handler might do something more interesting such as rendering  a view in response to model
changes.