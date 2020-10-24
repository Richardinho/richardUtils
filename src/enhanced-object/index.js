(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['../sundry'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../sundry'));
  } else {
    root.enhancedObject = factory(window.sundry);
  }
}(this, function () {

  'use strict';

  if (!window.Proxy || !isFunction(window.Proxy)) {
    throw new Error("Proxy function not implemented in this environment");
  }

  function isObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
  }

  function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }

  function extend(destination, source) {
    for (var k in source) {
      if (source.hasOwnProperty(k)) {
        destination[k] = source[k];
      }
    }

    return destination;
  }

  var events = {
    trigger : function (eventName) {
      if (!this.listeners || !this.listeners[eventName]) {
        return;
      }

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

      for (var key in this) {
        if (key !== 'listeners' && key !== 'parent') {
          var value = this[key];

          if (isObject(value)) {
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

      if (this.parent) {
        this.parent.fire.apply(this.parent, arguments);
      }
    }
  };

  var handler = {
    // intercepts property assignment on an object
    set: function (target, name, value) {
      if (name === 'parent' || name === 'listeners' || isFunction(value)) {
        target[name] = value;
        return true;
      }

      if (isObject(value)) {
        value.parent = target;

        // proxyupObj will iterate through all the props of the value obj. Since set is called whenever a property is set
        // if any of the child properties are objects, proxyupObj will be called recursively.

        target[name] = proxyUpObj(value);
      } else {
        //  primitive types are just assigned normally. We fire a change event.
        target[name] = value;
        target.fire("change:" + name, value, name);
        target.fire("change", value, name);
      }

      return true;
    }
  };

  function proxyUpObj(obj) {
    var proxy = new Proxy({}, handler);

    extend(proxy, events);

    for(var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        proxy[prop] = obj[prop];
      }
    }

    return proxy;
  }

  return proxyUpObj;
}));

