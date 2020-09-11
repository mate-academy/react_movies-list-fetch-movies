export function getMovie(movie) {
  return fetch(`http://www.omdbapi.com/?apikey=57694d91&t=${movie}`)
    .then(response => response.json());
}
