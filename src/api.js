const URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=a2426096&t=';

export function getMovie(title) {
  return fetch(`${URL}${title}`)
    .then(response => response.json())
    .catch(er => 'error');
}
