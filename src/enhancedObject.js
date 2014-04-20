define(function () {











/*
  experimental code to allow the creation of objects which can have event handlers attached to them with bubbling and broadcasting functionality supported.
  Uses the Proxy object which is so far only available in Firefox.

*/

/* todo:
   1. write some pretty rigorous tests for this.
   2. refactor, tidy up, correct mistakes etc.
   3. investigate current status of Proxy type.
   4. work into an actual software project to see it working 'live'
   5. write up as blog post.
   6. add ability to cancel propagation within handlers
   7. work in event namespacing



*/
var events = {

    trigger : function (eventName) {

        if(!this.listeners || !this.listeners[eventName]) return;

        var args = Array.prototype.slice.call(arguments, 1);

        this.listeners[eventName].forEach(function (listener) {

            listener.action.apply(listener.context, args);

        });
    },

    on : function (eventName, action, context) {

        if(!this.listeners) {

            this.listeners = {};
        }

        if(!this.listeners[eventName]) {

            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push({

            action : action,
            context : context

        });

    },
    // could pass through the event target, the object the event occurred on
    broadcast : function () {

        this.trigger.apply(this, arguments);

        for(var key in this) {

            if(key !== 'listeners' && key !== 'parent') {

                var value = this[key];

                if(isObject(value)) {

                    value.broadcast.apply(value, arguments);

                }
            }
        }
    },


    off : function () {
        // todo: to implement

    },

// could pass through the event target, the object the event occurred on
    fire : function () {


        this.trigger.apply(this, arguments);
        if(this.parent) {
            this.parent.fire.apply(this.parent, arguments);
        }

    }
};

// utility function
function isObject(value) {

    return Object.prototype.toString.call(value) === "[object Object]";

}

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}




var handler = {

    set : function (target, name, value) {
        // parent is an object, but we just want it to be assigned normally to the target
        if(name === 'parent') {
            target[name] = value;
            return;
        }
        //  listeners is an object but we just want it to be assigned normally
        if(  name === 'listeners' ) {
            target[name] = value;
            return;
        }

        if(isFunction(value)) {

            target[name] = value;
            return;

        }
         /*
           what I could do here is wrap the node in a custom objec which has the on, off , broadcast etc. methods rather than putting them into Object.prototype.
         */
        if(isObject(value)) {
            value.parent = target;

            target[name] = proxyUpObj(value); // proxyupObj will iterate through all the props of the value obj. Since set is called whenever a property is set
            // if any of the child properties are objects, proxyupObj will be called recursively.

        }
        //  primitive types are just assigned normally. We fire a change event.
        else {
            target[name] = value;
            target.fire("change", value);
        }
    }
};

function extend(destination, source) {
  for (var k in source) {
    if (source.hasOwnProperty(k)) {
      destination[k] = source[k];
    }
  }
  return destination;
}


function proxyUpObj(obj) {

    var proxy = new Proxy({}, handler);

    // mixin events
    extend(proxy, events);

    for(var prop in obj) {

         if(obj.hasOwnProperty(prop)) {

            proxy[prop] = obj[prop];

         }
    }
    return proxy;
}

return proxyUpObj;


});







































