function arrayPush(array, value) {
  return [...array, value];
}

function arraySplice(array, index) {
  return array.filter((_, i) => {
    return index !== i; 
  });
}

function createProxy(events, path) {
  const obj = path ? me[path] : me;

  var proxy = new Proxy(obj, {
    set: (target, key, value) => {
      setTimeout(() => {
        if (path) {
          events.fire(path + '.' + key, value);
        }

        events.fire(key, value);
      }, 0);

      target[key] = value;
    },
  });

  return proxy;
}

function wrap(component, events, path) {
  let proxy;

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

    proxy = createProxy(wrappedEvents, path);
    component(proxy, wrappedEvents);
  } else {
    proxy = createProxy(events);
    component(proxy, events);
  }
}
