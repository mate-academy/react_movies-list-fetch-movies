const BASE_URL = 'https://www.omdbapi.com/?';

export function getMovie(query) {
  return fetch(`${BASE_URL}t=${query}&apikey=214049a0`)
    .then(response => response.json());
}
