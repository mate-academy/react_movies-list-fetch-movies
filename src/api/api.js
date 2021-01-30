export function getMovie(title) {
  return fetch(`http://www.omdbapi.com/?apikey=d78ecd1c&t=${title}`)
    .then(response => response.json())
    .catch(er => 'error');
}
