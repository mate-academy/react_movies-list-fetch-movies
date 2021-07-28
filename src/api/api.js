const url = 'https://www.omdbapi.com/?apikey=3ba262ba';

export function getMovie(title) {
  return fetch(`${url}&t=${title}`)
    .then(response => response.json())
    .catch(error => alert.error('Error', error));
}
