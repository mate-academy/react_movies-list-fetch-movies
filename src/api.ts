const API_URL = 'https://www.omdbapi.com/?apikey=b2241fd4&t=';

export function getMovie(movieTitle: string): Promise<Movie> {
  return fetch(`${API_URL}${movieTitle}`)
    .then(response => response.json());
}
