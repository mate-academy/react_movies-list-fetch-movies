const API_KEY = 'db946b80';
const API_URL = 'http://www.omdbapi.com/';

export function getMoviesByTitle(title) {
  return fetch(`${API_URL}?apikey=${API_KEY}&t=${title}`)
    .then(respons => respons.json());
}
