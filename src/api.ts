import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=your-key';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}

// const getMovie = (query) => {

// }

// export const getMovie = async () => {
//   const response = await fetch(API_URL);

//   if (!response.ok) {
//     throw new Error(`${response.status} - ${response.statusText}`);
//   }

//   const body = await response.json();

//   return body;
// };
