'use strict';

console.log('Hello world');

const express = require('express');

const weatherData = require('./data/weather.json');

console.log(weatherData);

const app = express();

app.get('/', (request, response) => {
  response.send('Hello, from the server!');

});

app.get('/weather', (request, response) => {
  let cityNameRequested = request.query.searchQuery;
  let latRequested = request.query.lat;
  let lonRequested = request.query.lon;

  let cityFound = weatherData.find(obj => obj.city_name.toLowerCase() === cityNameRequested.toLowerCase() && obj.lat === latRequested && obj.lon === lonRequested);
  console.log(cityFound);
  response.send(`city is ${cityFound.city_name}`);
});

app.listen(3001, () => console.log('listening on port 3001'));

