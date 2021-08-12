'use strict';

const axios = require('axios');

let cache = require('./cache.js');

async function getMovies(city) {

  const key = `movies-${city}`;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${city}`;

  if (cache[key] && (Date.now() - cache[key].timestamp < (1000 * 60 * 60 * 24 * 30)) && cache[key].data) {
    console.log('Cache movie hit');
  } else {
    console.log('Cache movie miss');
    try {
      cache[key] = {};
      cache[key].timestamp = Date.now();
      let movieData = await axios.get(url);
      let moviesArray = movieData.data.results.map(movieObj => new Movie(movieObj));
      cache[key].data = moviesArray;

    } catch (error) {
      res.status(error.response.status).send(error.response.data);
      console.log('Error:', error.response.status, error.response.data.errors);      
    }
  }
  return cache[key].data;
};

class Movie {
  constructor(movieObj) {
    this.title = movieObj.title;
    this.overview = movieObj.overview;
    this.average_votes = movieObj.vote_average;
    this.total_votes = movieObj.vote_count;
    this.image_url = movieObj.poster_path
      ? `https://image.tmdb.org/t/p/w500${movieObj.poster_path}`
      : "";
    this.popularity = movieObj.popularity;
    this.releasedOn = movieObj.release_date;
  }
}

module.exports = getMovies;