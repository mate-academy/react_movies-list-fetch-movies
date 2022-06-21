const API_URL = 'https://www.omdbapi.com/?apikey=45ae581e';

export function getMovie(title: string) {
  return fetch(`${API_URL}&t=${title}`)
    .then(response => response.json());
}
