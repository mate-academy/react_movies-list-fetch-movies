export const getMovie = async (title: string): Promise<Movie> => {
  const url = `https://www.omdbapi.com/?apikey=fd8ca59d&t=${title}`;

  const response = await fetch(url);
  const movie = await response.json();

  if (movie.Response === 'False') {
    throw new Error('Movie is not found');
  }

  return movie;
};
