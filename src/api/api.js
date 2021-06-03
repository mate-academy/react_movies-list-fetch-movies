// eslint-disable-next-line
const API_URL = `https://www.omdbapi.com/?apikey=859d9c7f&`;

export function getMovieByTitle(title) {
  return fetch(`${API_URL}t=${title}`)
    .then(response => response.json());
}
