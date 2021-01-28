const url = 'https://www.omdbapi.com/?apikey=b49501d4&t=';

export function getMovie(movieNamePart) {
  return fetch(`${url}${movieNamePart}`)
    .then(promise => promise.json());
}
