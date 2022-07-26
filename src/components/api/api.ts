import Movie from '../type/Movie';

const url = 'https://www.omdbapi.com/?apikey=67638620';

export const getMovie = async (title: string): Promise<Movie> => {
  const response = await fetch(`${url}&t=${title}`);

  return response.json();
};
