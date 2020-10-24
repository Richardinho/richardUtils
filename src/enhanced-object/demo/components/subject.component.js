function subjectComponent(model, events) {

  const subjectInputEl = document.getElementById('subject-input');
  const subjectEl = document.getElementById('subject-view');

  subjectInputEl.addEventListener('input', (event) => {
    model.subject = event.target.value
  });

  events.onPropertyChange('subject', render);

  function render() {
    subjectEl.textContent = model.subject;
  }

  render();
}
