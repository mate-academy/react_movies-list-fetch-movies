const BASE_URL = 'http://www.omdbapi.com/';
const API_KEY = 'ab0cbce';

export function getMovie(query: string): Promise<Movie> {
  return fetch(`${BASE_URL}?t=${query}&apikey=${API_KEY}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}
