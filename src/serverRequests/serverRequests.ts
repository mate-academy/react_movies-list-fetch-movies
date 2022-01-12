export function getFilm(title: string) {
  return fetch(`https://www.omdbapi.com/?apikey=c2c705e9&t=${title}`)
    .then(response => response.json());
}
