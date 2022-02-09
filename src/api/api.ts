const API_URL = 'https://www.omdbapi.com/?apikey=e77a0abc&t=';

export async function getMovieByTitle(title: string): Promise<Movie> {
  try {
    const response = await fetch(`${API_URL}${title}`);

    return await response.json();
  } catch {
    throw new Error('error');
  }
}
