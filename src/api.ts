import { MovieApiError } from './erros/MovieApiError';
import { MovieData } from './types/MovieData';
// import { ResponseError } from './types/ReponseError';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export function getMovie(query: string): Promise<MovieData> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .then(data => {
      if (data.Response === 'False') {
        throw new Error(data.Error);
      }

      return data;
    })
    .catch(error => {
      throw new MovieApiError(error.message || 'unexpected error');
    });
}
