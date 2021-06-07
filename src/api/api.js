const API_URL = 'https://www.omdbapi.com/';

export function getFilm(title) {
  return fetch(`${API_URL}/?t=${title}&apikey=e6989aef`)
    .then(response => response.json());
}
