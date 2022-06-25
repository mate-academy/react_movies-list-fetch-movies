import { Movie } from '../react-app-env';

const URL_API = 'http://www.omdbapi.com';
const KEY = '2936a80b';

const MovieURL = `${URL_API}/?apikey=${KEY}`;

export const getMovieListFromServer = async (title: string): Promise<Movie> => {
  try {
    const response = await fetch(`${MovieURL}&t=${title}`);

    return await response.json();
  } catch (error) {
    throw new Error('Movie is not found!');
  }
};
