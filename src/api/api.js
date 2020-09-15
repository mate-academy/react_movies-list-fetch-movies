export function getMovie(title) {
  return fetch(`http://www.omdbapi.com/?apikey=29a96ee7&t=${title}`)
    .then(response => response.json());
}
