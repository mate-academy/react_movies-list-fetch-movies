const GET_MOVIE_API = 'https://www.omdbapi.com/?apikey=dc7441d9&t=';

export async function getMovieByTitle(title: string): Promise<Movie> {
  const responce = await fetch(`${GET_MOVIE_API}${title}`);
  const json = await responce.json();

  return json;
}
