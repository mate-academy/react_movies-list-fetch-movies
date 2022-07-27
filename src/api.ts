import { Movie } from './react-app-env';

const BASE_URL = 'https://www.omdbapi.com/?apikey=a56ca071&t=';

export const getMovie = async (title: string):Promise<Movie> => {
  const res = await fetch(`${BASE_URL}${title}`);

  return res.json();
};
