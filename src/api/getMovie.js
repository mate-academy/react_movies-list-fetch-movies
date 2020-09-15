const MOVIE_URL = 'https://www.omdbapi.com';
const apikey = '?apikey=288929c0';

export const getMovie = query => fetch(`${MOVIE_URL}/${apikey}&t=${query}`)
  .then(response => response.json());
