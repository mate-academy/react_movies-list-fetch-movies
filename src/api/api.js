const BASE_URL = 'http://www.omdbapi.com/?apikey=c364c392&t=';

export function getMovie(title) {
  return fetch(`${BASE_URL}${title}`)
    .then(response => response.json());
}
