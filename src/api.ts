import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = ' http://www.omdbapi.com/?i=tt3896198&apikey=e48398ea';

function sleeper(ms:number) {
  return (x: Response): Promise<Response> => {
    return new Promise(resolve => setTimeout(() => resolve(x), ms));
  };
}

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(sleeper(500))
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
