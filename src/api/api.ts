const GET_MOVIE_API = 'https://www.omdbapi.com/?apikey=dc7441d9&t=';

export async function getMovieByTitle(title: string) {
  const response = await fetch(`${GET_MOVIE_API}${title}`);
  const foundedMovie = await response.json();

  if (foundedMovie.Response === 'False') {
    return null;
  }

  return foundedMovie;
}
