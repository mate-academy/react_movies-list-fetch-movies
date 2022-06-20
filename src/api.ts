export const findMovie = async (title: string): Promise<Movie> => {
  const response = await fetch(`https://www.omdbapi.com/?apikey=dc81e642&t=${title}`);
  const movie = await response.json();

  if (movie.imdbID === undefined) {
    throw new Error('Movie is undefined');
  }

  return movie;
};
