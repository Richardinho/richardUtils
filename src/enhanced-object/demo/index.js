const me = {
  name: 'Richard',
  job: 'unemployed',
  address: [
    '35 Spencer Mews',
    'Greyound Road',
    'London',
  ],
  favourites: [
    'carrots',
    'beetroot',
  ],
  interests: {
    subject: 'painting',
  },
};

var events = new Events();

wrap(nameComponent, events);
wrap(jobComponent, events);
wrap(dataComponent, events);
wrap(favouritesComponent, events);
wrap(subjectComponent, events, 'interests');

