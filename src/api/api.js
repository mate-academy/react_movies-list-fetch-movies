const BASE_URL = 'https://www.omdbapi.com/?apikey=b6a68b47&t=';

export function request(searchQuery) {
  return fetch(`${BASE_URL}${searchQuery}`)
    .then(response => response.json());
}
