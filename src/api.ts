const url = 'https://www.omdbapi.com/?apikey=945b7878&t=';

export async function getMovie(title: string): Promise<Movie> {
  const movie = await fetch(`${url}${title}`);

  return movie.json();
}
