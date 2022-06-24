const BASE_URL = 'https://www.omdbapi.com/?apikey=d8fec2ef';

export const searchMovies = async (title: string): Promise<Movie> => {
  const response = await fetch(`${BASE_URL}&t=${title}`);
  const res = await response.json();

  if (res.Response === 'True') {
    return res;
  }

  throw new Error('Movie not found!');
};
