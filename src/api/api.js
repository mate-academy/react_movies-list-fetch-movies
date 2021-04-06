const API_URL = `https://www.omdbapi.com/?apikey=cc4d4024&t=`;

export function getMovie(movie) {
  return fetch(`${API_URL}${movie}`)
    .then(response => response.json());
}
