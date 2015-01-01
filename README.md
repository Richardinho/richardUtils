Javascript utility code
=======================

proxy object with event handling capabilities
---------------------------------------------

#### intro
Enhances a javascript object by providing event handler registration capability. Events can be fired on a property which handlers for descendant or parent properties
can respond to.

I propose a use case for this structure to be as a model for an application whereby components can register listeners to those parts of the model that they are
concerned with, but also communicate with other parts of the application by firing events on the model. This removes the need
for extra complex event handling code to be written.

#### usage

The code is supplied as a Require AMD module. The module returns a function which you can call whatever you like. For the purposes of this article
it is called 'createProxyObj'.

Pass a plain old javascript object to the `createProxyObj()` function. This returns a proxy object on which you can set and get properties
 in exactly the same way as you would with a normal object.


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
'this is bar' will be printed to the console.

Listeners also listen to changes occurring on descendant nodes. The code:  `pojso.vehicles.cars.bugatti = "a new bugatti";`  would
also result in the handler listening to change events on the root node being called.

#####custom events
Change events are fired automatically when a property is updated. It is also possible to manually trigger events on an object. There are 3 distinct
ways of triggering an event on an object. the basic command `trigger()` triggers an event on - and only on - that object. Only listeners
for that event directly registered on that object will be called. Calling `fire()` will trigger an event on that object, but the event will 'bubble up'
to all parent objects and called registered listeners on those. Finally, `broadcast()` will trigger an event on an object and all descendent objects.

    /* fire() */
    //  register a handler on the root node for the 'bar' event
    pojso.on("bar", foo.myHandlerFunction, foo);

    //  handler will be called and arg1 and arg2 will be passed to it.
    pojso.vehicles.cars.fire("bar", "arg1", "arg2");

    /* broadcast() */
    //  register a handler on a descendant object of the root
    pojso.vehicles.cars.on("blah", foo.myhandlerFunction , foo);

    //  handler will be called with arg1 and arg2 passed to it.
    pojso.broadcast("blah", "arg1", "arg2")

#####Adding additional objects as properties to proxy after it has been created

It is possible to add new object properties to the proxy object after it has been created. Event handling methods will be automatically
attached to them.

    proxy.on("hello", helloHandler);

    //  add tractors object as a new property of proxy.vehicles.
    proxy.vehicles.tractors = {
        "massyFerguson" : "massyFerguson",
        "johnDeer" : "johnDeer",
        others : {
            another : "another tractor"
        }
    }

    proxy.vehicles.tractors.fire("hello"); //  helloHandler will be called automatically at this point.



####Under the hood
This code makes use of the javscript Proxy() type which allows you to intercept various standard
javascript object behaviours such as setting or getting a property and inject your own custom code to carry them out. In my code, what happens
is that the set action is intercepted, the proposed new value is inspected, and if it is found to be an object, the event handling methods are mixed
into it.

Proxy is still experimental technology and unfortunately,  is, to date (April 2014), only available in the Firefox browser. It is therefore not
recommended that this code is used in any production environment! I would be interested in hearing if anyone knows about current plans in IE, Chrome
for implementing the Proxy function.


