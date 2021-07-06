const BASE_URL = 'https://www.omdbapi.com/?apikey=f90e9294&t=';

export function getMovie(title) {
  return fetch(`${BASE_URL}${title}`)
    .then(response => response.json());
}
