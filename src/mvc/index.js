(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define([
      './events',
      './utils',
      './router'], function (
        Events,
        utils,
        Router) {
      return factory(
        Events,
        utils,
        Router);
    });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('./events'),
      require('./utils'),
      require('./router'));
  } else {
    root.mvc = factory(
      window.Events,
      window.utils,
      window.Router);
  }
}(this, function (Events, utils, Router) {

  'use strict';

  function createProxy(model, events, path) {
    var obj = path ? model[path] : model;

    var proxy = new Proxy(obj, {
      set: function (target, key, value) {
        setTimeout(function () {
          if (path) {
            events.fire(path + '.' + key, value);
          }

          events.fire(key, value);
        }, 0);

        target[key] = value;

        return true;
      },
    });

    return proxy;
  }

  function createComponent(proxy, component, events, path) {

    if (path) {
      var wrappedEvents = {
        fire: function (key, value) {
          events.fire(path + '.' + key, value);
        },
        onPropertyChange: function (key, handler) {
          events.onPropertyChange(key, handler, path);
        },
        onAllPropertyChanges: events.onAllPropertyChanges,
      };

      component(proxy, wrappedEvents);
    } else {
      component(proxy, events);
    }
  }

  return {
    createProxy: createProxy,
    createComponent: createComponent,
    Events: Events,
    utils: utils,
    Router: Router,
  };

}));
