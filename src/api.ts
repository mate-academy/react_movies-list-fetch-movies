// import { MovieData } from './types/MovieData';
// import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=3c7a52de';

export async function getMovie(query: string) {
  const response = await fetch(`${API_URL}&t=${query}`);

  return response.json();
}
