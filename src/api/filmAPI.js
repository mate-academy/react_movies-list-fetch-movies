const BASE_URL = 'http://www.omdbapi.com/';
const API_KEY = 'apikey=31a05162';

export function movieRequest(title) {
  return fetch(`${BASE_URL}?t=${title}&${API_KEY}`)
    .then(response => response.json());
}
