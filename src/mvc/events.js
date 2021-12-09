(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
		define([], function () {
			return factory();
		});
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.enhancedObject = factory();
  }
}(this, function () {

  "use strict";

  function Events() {
    this.listeners = {};
  }

  Events.prototype.onAllPropertyChanges = function(handler) {
    if (!this.listeners.allChanges) {
      this.listeners.allChanges = [];
    }

    this.listeners.allChanges.push(handler);
  };

  Events.prototype.onPropertyChange = function(key, handler, prefix) {
    var _key;

    if(prefix) {
      _key = prefix + '.' + key;
    } else {
      _key = key;
    }

    if (!this.listeners[_key]) {
      this.listeners[_key] = [];
    }

    this.listeners[_key].push(handler);
  };

  Events.prototype.fire = function (key) {
    if (this.listeners[key]) {
      this.listeners[key].forEach(function(handler) {
        handler(); 
      });
    }

    if (this.listeners.allChanges) {
      this.listeners.allChanges.forEach(function (handler) {
        handler();
      });
    }
  };

  return Events;
}));
