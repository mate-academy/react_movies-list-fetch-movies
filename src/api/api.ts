const API_URL = 'https://www.omdbapi.com/?apikey=8ced5c19&t=';

export async function getMovie<Movie>(input: string): Promise<Movie> {
  try {
    const response = await fetch(`${API_URL}${input}`);
    const movie: Movie = await response.json();

    return movie;
  } catch {
    throw new Error('error');
  }
}
