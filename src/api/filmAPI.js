const BASE_URL = 'https://www.omdbapi.com/';
const API_KEY = 'apikey=31a05162';

export function movieRequest(title) {
  return fetch(`${BASE_URL}?t=${title}&${API_KEY}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      return response.json();
    });
}
