const BASE_URL = 'http://www.omdbapi.com/?apikey=81ba3e21';

export function getMovie(title) {
  return fetch(`${BASE_URL}&t=${title}`)
    .then(resp => resp.json());
}
