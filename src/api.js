export function getMovie(title) {
  return fetch(`https://www.omdbapi.com/?apikey=6e3cbe75&t=${title}`)
    .then(response => response.json());
}
