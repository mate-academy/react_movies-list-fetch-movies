const API_URL = 'https://www.omdbapi.com/?apikey=8ced5c19';

async function getData<T>(url: string): Promise<T> {
  const response = await fetch(`${API_URL}${url}`);

  return response.json();
}

export function getMovie(input: string) {
  return getData<Movie>(`&t=${input}`);
}
