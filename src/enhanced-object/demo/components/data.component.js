
function dataComponent(proxy, events) {
  const dataEl = document.getElementById('data-view');

  function render() {
    dataEl.innerHTML = JSON.stringify(proxy, null, 2);
  }

  events.onAllPropertyChanges(render);

  render();
}
