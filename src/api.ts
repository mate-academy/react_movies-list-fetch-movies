const url = 'http://www.omdbapi.com/?i=tt3896198&apikey=f3a7d222';

export const requestMovies = async (title: string): Promise<Movie> => {
  const response = await fetch(`${url}&t=${title}`);
  const movie = await response.json();

  if (movie.Response === 'False') {
    throw new Error('Movie is not exist');
  }

  return movie;
};
