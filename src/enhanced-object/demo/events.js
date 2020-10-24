
function Events() {
  this.listeners = {};
}

Events.prototype.onAllPropertyChanges = function(handler) {
  if (!this.listeners.allChanges) {
    this.listeners.allChanges = [];
  }

  this.listeners.allChanges.push(handler);
}

Events.prototype.onPropertyChange = function(key, handler, prefix) {
  var _key = prefix + '.' + key;
  if (!this.listeners[_key]) {
    this.listeners[_key] = [];
  }

  this.listeners[_key].push(handler);
};

Events.prototype.fire = function (key, value) {
  if (this.listeners[key]) {
    this.listeners[key].forEach(handler => handler());
  }

  if (this.listeners.allChanges) {
    this.listeners.allChanges.forEach(handler => handler());
  }
}
