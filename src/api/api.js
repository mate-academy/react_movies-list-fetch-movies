const BASE_URL = 'https://www.omdbapi.com/?apikey=9104d067';

export function getMovie(title) {
  return fetch(`${BASE_URL}&t=${title}`)
    .then(response => response.json());
}
