const API_URL = `https://www.omdbapi.com/?apikey=eb084562`;

export function getMovie(title) {
  return fetch(`${API_URL}&t=${title}`)
    .then(response => response.json());
}
