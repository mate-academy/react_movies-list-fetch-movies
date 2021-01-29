const BASE_URL = `https://www.omdbapi.com/?apikey=5e79351c&`;

export function getMovie(title) {
  return fetch(`${BASE_URL}t=${title}`)
    .then(response => response.json());
}
