# Enhanced Object
experimental code to allow the creation of objects which can have event handlers attached to them with bubbling and broadcasting functionality supported.


 todo:
   4. work into an actual software project to see it working 'live'
   5. write up as blog post.
   6. add ability to cancel propagation within handlers
   7. work in event namespacing

####Under the hood
This code makes use of the Javscript `Proxy` type which allows you to intercept various standard
javascript object behaviours, such as setting or getting a property, and injecting your own custom code to carry them out.
In my code, what happens is that the set action is intercepted, the proposed new value is inspected, and if it is found to be an object, the event handling methods are mixed
into it.



