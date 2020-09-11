const BASE_URL = 'http://www.omdbapi.com/?apikey=57694d91&t=';

export function getMovie(movie) {
  return fetch(`${BASE_URL}${movie}`)
    .then(response => response.json());
}
