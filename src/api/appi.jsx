
const API_URL = 'https://www.omdbapi.com/?apikey=bdd9d5ee&t=';

export function allMovies(url) {
  return fetch(API_URL + url)
    .then(response => response.json());
}
