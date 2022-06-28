export async function requestMovie(title: string): Promise<Movie> {
  const response = await fetch(`https://www.omdbapi.com/?apikey=d1e7cc14&t=${title}`);
  const result = await response.json();

  if (result.Response === 'False') {
    throw new Error('movie does not exist');
  }

  return result;
}
