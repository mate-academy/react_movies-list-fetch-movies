const API_URL = 'https://www.omdbapi.com/?apikey=2ac52d23';

export function getMovie(query: string) {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
