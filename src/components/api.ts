const BASE_URL = 'https://www.omdbapi.com/';
const API_KEY = 'ab0cbce';

export async function getMovie(query: string): Promise<Movie> {
  const response = await fetch(`${BASE_URL}?t=${query}&apikey=${API_KEY}`);

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  return response.json();
}
