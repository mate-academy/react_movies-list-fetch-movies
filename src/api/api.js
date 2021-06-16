export function getMovie(title) {
  const API_URL = `https://www.omdbapi.com/?apikey=1e23943c&t=`;

  return fetch(`${API_URL}&t=${title}`)
    .then(res => res.json());
}
