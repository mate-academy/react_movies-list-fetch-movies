const API_DATA_URL = 'http://www.omdbapi.com';
const API_KEY = '26d463cc';

export async function getData(title: string): Promise<Movie> {
  const response = await fetch(`${API_DATA_URL}/?apikey=${API_KEY}&t=${title}`);

  return response.json();
}
