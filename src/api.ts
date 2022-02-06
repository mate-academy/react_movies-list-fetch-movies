const API_URL = 'https://www.omdbapi.com/?apikey=93e72efb&t=';

export async function getMovie(title: string): Promise<Movie> {
  const response = await fetch(`${API_URL}${title}`);

  return response.json();
}
