const API_KEY = 'fce5a15';
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export function getMovie(movieTitle) {
  return fetch(`${BASE_URL}&t=${movieTitle}`)
    .then(response => response.json());
}
