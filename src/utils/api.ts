import { BASE_URL } from '../constants/api';
import { MovieFromServer } from '../constants/types';

export const getMovieData = async (URL: string): Promise<MovieFromServer> => {
  const movieData = await fetch(`${BASE_URL}${URL}`);

  return movieData.json();
};
