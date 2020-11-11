const apiKey = 'cbb5e647';
const url = 'https://www.omdbapi.com/?apikey=';

export function searchMovie(title) {
  return fetch(`${url + apiKey}&t=${title}`)
    .then(response => response.json());
}
