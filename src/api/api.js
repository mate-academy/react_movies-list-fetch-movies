export function getMovie(title) {
  return fetch(`http://www.omdbapi.com/?apikey=25bd52c9&t=${title}`)
    .then(response => response.json())
    .catch(er => 'error');
}
