// eslint-disable-next-line
const API_URL = `http://www.omdbapi.com/?apikey=859d9c7f&`;

export function getMovieByTitle(title) {
  return fetch(`${API_URL}t=${title}`)
    .then(response => response.json());
}
