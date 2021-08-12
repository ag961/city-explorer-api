'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
require('dotenv').config();

const weather = require('./weather.js');
const movies = require('./movies.js');

app.get('/', (request, response) => {
  response.send('Hello, from the server!');
});

//-----------------Weather----------------------------//
app.get('/weather', weatherHandler);

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  weather(lat, lon)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(500).send('Sorry. Something went wrong with weather request!');
    });
}

//--------------------Movies--------------------------//
app.get('/movies', moviesHandler);

function moviesHandler(request, response) {
  const {searchQuery} = request.query;  
  movies(searchQuery)
    .then(movieData => response.send(movieData))
    .catch(error => {
      console.error(error);
      response.status(500).send('Sorry. Something went wrong with movies request!');
    });
}

//------------------catch all, listen-----------------//
app.get('/*', (request, response) => {
  response.status(404).send('Path does not exists');
});

app.listen(process.env.PORT, () => console.log(`Server up on ${process.env.PORT}`));
