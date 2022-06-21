const myKey = 'c9d98407';
const URL = `https://www.omdbapi.com/?apikey=${myKey}&t=`;

export async function getMovie(title: string): Promise<Movie> {
  const response = await fetch(`${URL}${title}`);
  const result = await response.json();

  if (result.Response === 'False') {
    throw new Error('movie does not exist');
  }

  return result;
}
