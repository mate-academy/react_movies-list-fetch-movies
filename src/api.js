const API_URL = 'https://www.omdbapi.com/?apikey=8ad6cc4&t';

export function getMoviesByTitle(title) {
  return fetch(`${API_URL}=${title}`)
    .then(response => response.json());
}
