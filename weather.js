'use strict';

const axios = require('axios');

let cache = require('./cache.js');

function getWeather(lat, lon) {

  const key = `weather-${lat}&${lon}`;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHER_API_KEY}&lang=en&lat=${lat}&lon=${lon}&days=3`;

  if (cache[key] && (Date.now() - cache[key].timestamp < (1000 * 60 * 60 * 24))) {
    console.log('Cache weather hit');
  } else {
    console.log('Cache weather miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(url)
      .then(response => parseWeather(response.data))
      .catch(error => console.log(error.message));
  }

  return cache[key].data;
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map(day => {
      return new Weather(day);
    });
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Weather {
  constructor(day) {
    this.description = `Low of ${day.low_temp}, high of ${day.high_temp} with ${day.weather.description.toLowerCase()}`;
    this.date = day.datetime;
  }
}

module.exports = getWeather;
