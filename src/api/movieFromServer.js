const BASE_URL = 'http://www.omdbapi.com/?apikey=4becbea0&t=';

export function getMovie(endPoint) {
  return fetch(`${BASE_URL}${endPoint}`)
    .then(response => response.json());
}
