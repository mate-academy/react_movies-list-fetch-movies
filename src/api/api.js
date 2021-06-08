const baseUrl = 'http://www.omdbapi.com/?apikey=a15109cc&t=';

export function getMovie(title) {
  return fetch(`${baseUrl}${title}`)
    .then(response => response.json());
}
