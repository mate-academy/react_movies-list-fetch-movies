const API_URL = 'https://www.omdbapi.com/?apikey=1734dfe';

export function getMovie(query: string) {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
