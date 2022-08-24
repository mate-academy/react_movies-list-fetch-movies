const API_URL = 'https://www.omdbapi.com/?apikey=6f8d2a14';

export function getMovie(query: string) {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
