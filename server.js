'use strict';

console.log('Hello world');

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
require('dotenv').config();
const axios = require('axios');
const PORT = process.env.PORT;
//--------------------------------------------------------------//

class Forecast {
  constructor(description, date) {
    this.description = description;
    this.date = date;
  }
}
// const weatherData = require('./data/weather.json');

// let url = 'https://api.weatherbit.io/v2.0/current?key=276195ea2de14dd188ff597754c11e6f&lat=55.6412879&lon=51.8160376';

app.get('/', (request, response) => {
  response.send('Hello, from the server!');
});

app.get('/weather', async (request, response) => {
  let cityNameRequested = request.query.searchQuery;
  let latRequested = request.query.lat;
  let lonRequested = request.query.lon;

  let cityFound = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${latRequested}&lon=${lonRequested}`);

  

  // let cityFound = weatherData.find(obj => obj.city_name.toLowerCase() === cityNameRequested.toLowerCase() && obj.lat === latRequested && obj.lon === lonRequested);
  let forecastArray = [];

  if (cityFound.data) {
    cityFound.data.data.forEach(obj => forecastArray.push(new Forecast(`Low of ${obj.low_temp}, high of ${obj.high_temp} with ${obj.weather.description.toLowerCase()}`, obj.datetime)));
    response.send(forecastArray);
  } else {
    response.status(400).send('No weather data exists for this city');
  }
});

app.get('/*', (request, response) => {
  response.status(404).send('Path does not exists');
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));

