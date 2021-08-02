'use strict';

console.log('Hello world');

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
require('dotenv').config();
const PORT = process.env.PORT;
//--------------------------------------------------------------//

class Forecast {
  constructor(description, date) {
    this.description = description;
    this.date = date;
  }
}
const weatherData = require('./data/weather.json');


app.get('/', (request, response) => {
  response.send('Hello, from the server!');
});

app.get('/weather', (request, response) => {
  let cityNameRequested = request.query.searchQuery;
  let latRequested = parseInt(request.query.lat);
  let lonRequested = parseInt(request.query.lon);
  let cityFound = weatherData.find(obj => obj.city_name.toLowerCase() === cityNameRequested.toLowerCase() && parseInt(obj.lat) === latRequested && parseInt(obj.lon) === lonRequested);
  let forecastArray = [];

  if (cityFound) {
    cityFound.data.forEach(obj => forecastArray.push(new Forecast(`Low of ${obj.low_temp}, high of ${obj.high_temp} with ${obj.weather.description}`, obj.datetime)));
    response.send(forecastArray);
  } else {
    response.status(404).send('No weather data exists for this city');
  }
});

app.get('/*', (request, response) => {
  response.status(500).send('Path does not exists');
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));

