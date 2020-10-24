const foo = {
  name: 'Richard',
  job: 'unemployed',
  city: 'London',
  countryOfResidence: 'England',
  likes: [
    'Chess',
    'painting',
    'food',
  ], 
};


function renderJobComponent() {
  const el = document.getElementById('job-container');
  el.innerHTML = `
    <div>${foo.job}</div>
  `;);
}

watch(foo, 'job', function () {
  renderJobComponent();
});

foo.job = newJob;


/*
 
Imagine if you could have data that was *alive*.
Data is a representation of the real world, but it's really a static snapshot.

In the real world, everything is affected by other things. If a billiard ball hits another, they both will go shooting
off in different directions.
In data that was representing these, you would have to change the data in two separate places.

Imagine if, instead of this, the data was somehow smart enough to update itself?





 */


