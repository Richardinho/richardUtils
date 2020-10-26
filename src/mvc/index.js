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


  function createProxy(model, events, path) {
    const obj = path ? model[path] : model;

    var proxy = new Proxy(obj, {
      set: (target, key, value) => {
        setTimeout(() => {
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
      const wrappedEvents = {
        fire: (key, value) => {
          events.fire(path + '.' + key, value);
        },
        onPropertyChange: (key, handler) => {
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
