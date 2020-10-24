function nameComponent(proxy, events) {
  const nameInputEl = document.getElementById('name-input');
  const nameEl = document.getElementById('name-view');

  nameInputEl.addEventListener('input', (event) => {
    proxy.name = event.target.value
  });

  events.onPropertyChange('name', render);

  function render() {
    nameEl.textContent = proxy.name;
  }

  render();
}
