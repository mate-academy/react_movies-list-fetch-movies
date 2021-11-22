const MOVIE_API = 'https://www.omdbapi.com/?apikey=c122ff4d&t=';

export async function getMovieByTitle(title: string): Promise<Movie> {
  const response = await fetch(`${MOVIE_API}${title}`);
  const movie = await response.json();

  if (movie.Response === 'True') {
    return movie;
  }

  throw new Error(`Error: ${movie.Error}`);
}
