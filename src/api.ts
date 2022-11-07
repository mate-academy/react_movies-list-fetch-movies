import { MovieData } from './types/MovieData';

const API_KEY = '98ec4eff';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export function getMovie(query: string): Promise<MovieData> {
  return fetch(`${API_URL}&t=${query}`)
    .then(response => {
      return response.json();
    })
    .then(res => {
      if (res.Response === 'False') {
        throw new Error();
      }

      return res;
    });
}
