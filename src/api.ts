import { MovieData } from './types/MovieData';

const API_URL = 'https://www.omdbapi.com/?apikey=68fbcc03';

// eslint-disable-next-line max-len
export async function getMovie(query: string): Promise<MovieData> {
  let response;

  try {
    response = await fetch(`${API_URL}&t=${query}`);
    response = await response.json();

    if ('Error' in response) {
      throw new Error();
    }
  } catch (error) {
    throw new Error();
  }

  return response;
}
