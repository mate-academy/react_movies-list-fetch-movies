const BASE_URL = 'https://www.omdbapi.com/?apikey=6bb1d693';

export function getMovie(title: string) {
  return fetch(`${BASE_URL}&t=${title}`)
    .then(response => response.json());
}
