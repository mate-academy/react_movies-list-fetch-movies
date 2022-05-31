const MOVIE_URL = 'https://www.omdbapi.com/?apikey=95e31c65&t=';

export async function getMovie(title: string): Promise<Movie> {
  const respone = await fetch(`${MOVIE_URL}${title}`);

  return respone.json();
}
