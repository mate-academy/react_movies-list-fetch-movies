const apiKey = 'cbb5e647';
const url = 'http://www.omdbapi.com/?apikey=';

export function searchMovie(title) {
  return fetch(`${url + apiKey}&t=${title}`)
    .then(response => response.json());
}
