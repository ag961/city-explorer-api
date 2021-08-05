'use strict';

console.log('Hello world');

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
require('dotenv').config();
const axios = require('axios');
const PORT = process.env.PORT;
//-------------------------Weather-------------------------------------//

class Forecast {
  constructor(description, date) {
    this.description = description;
    this.date = date;
  }
}

app.get('/', (request, response) => {
  response.send('Hello, from the server!');
});

app.get('/weather', async (request, response) => {
  
  let latRequested = request.query.lat;
  let lonRequested = request.query.lon;

  let weatherRaw = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${latRequested}&lon=${lonRequested}`);

  let forecastArray = [];

  if (weatherRaw.data) {
    weatherRaw.data.data.forEach(obj => forecastArray.push(new Forecast(`Low of ${obj.low_temp}, high of ${obj.high_temp} with ${obj.weather.description.toLowerCase()}`, obj.datetime)));
    response.send(forecastArray);
  } else {
    response.status(400).send('No weather data exists for this city');
  }
});

//------------------Movies--------------------------------------------//

class Movie {
  constructor(title, overview, avgVotes, totalVotes, imgUrl, popularity, releasedOn) {
    this.title = title;
    this.overview = overview;
    this.average_votes = avgVotes;
    this.total_votes = totalVotes;
    this.image_url = imgUrl ? `https://image.tmdb.org/t/p/w500${imgUrl}` : "";
    this.popularity = popularity;
    this.releasedOn = releasedOn;
  }
}

app.get('/movies', async (req, res) => {
  try {
    let city = req.query.searchQuery;
    let movieData = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${city}`);

    let moviesArray = movieData.data.results.map(movieObj => new Movie(movieObj.title, movieObj.overview, movieObj.vote_average, movieObj.vote_count, movieObj.poster_path, movieObj.popularity, movieObj.release_date));

    res.send(moviesArray);

  } catch (error) {
    res.send(error.response)
  }
})

//--------------------------------------------------------------------------//

app.get('/*', (request, response) => {
  response.status(404).send('Path does not exists');
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));

