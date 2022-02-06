const API_URL = 'https://www.omdbapi.com';

export async function getMovie(title: string): Promise<Movie> {
  const response = await fetch(`${API_URL}/?apikey=1bff3e24&t=${title}`);

  return response.json();
}
