const BASE_URL = 'https://www.omdbapi.com/?apikey=e78a8bc0&t=';

export function getMovie(query) {
  return fetch(`${BASE_URL}${query}`)
    .then(response => response.json());
}
