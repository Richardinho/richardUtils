function favouritesComponent(proxy, events) {
  const favouritesEl = document.getElementById('favourites-view');
  const favouriteInputEl = document.getElementById('favourite-input');

  favouriteInputEl.addEventListener('change', (event) => {
    proxy.favourites = arrayPush(proxy.favourites, event.target.value);
    favouriteInputEl.value = '';
  });

  events.onPropertyChange('favourites', render);

  function render() {
    favouritesEl.innerHTML = '';
    const listEls = proxy.favourites.map((favourite, index) => {
      const li = document.createElement('li');
      const text = document.createTextNode(favourite);
      li.append(text);
      const button = document.createElement('button');
      button.textContent = 'del';

      button.addEventListener('click', () => {
        proxy.favourites = arraySplice(proxy.favourites, index);
      });

      li.append(button);
      return li;
    });

    favouritesEl.append(...listEls);
  }

  render();
}
