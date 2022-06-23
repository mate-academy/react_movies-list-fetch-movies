const URL = 'http://www.omdbapi.com/?apikey=';

const API_KEY = 'f3a7d222';

export const requestMovies = async (title: string): Promise<Movie> => {
  const response = await fetch(`${URL}${API_KEY}&t=${title}`);
  const movie = await response.json();

  if (movie.Response === 'False') {
    throw new Error('Movie is not exist');
  }

  return movie;
};
