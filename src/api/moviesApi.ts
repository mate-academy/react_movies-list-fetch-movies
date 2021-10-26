export const API_URL = 'https://www.omdbapi.com/?apikey=f3cb668d&';

export function getMovie(string: string): Promise<Movie> {
  return fetch(`${API_URL}t=${string}`)
    .then(response => response.json());
}
