export function getMovie(title) {
  return fetch(`https://www.omdbapi.com/?apikey=d78ecd1c&t=${title}`)
    .then(response => response.json())
    .catch(er => 'error');
}
