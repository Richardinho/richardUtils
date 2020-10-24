function jobComponent(model, events) {

  const jobInputEl = document.getElementById('job-input');
  const jobEl = document.getElementById('job-view');

  jobInputEl.addEventListener('input', (event) => {
    model.job = event.target.value
  });

  events.onPropertyChange('job', render);

  function render() {
    jobEl.textContent = model.job;
  }

  render();
}
