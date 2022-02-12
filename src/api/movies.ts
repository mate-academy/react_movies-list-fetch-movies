const API_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=35b47ad';

export async function targetMovie(title: string): Promise<Movie> {
  const url = `${API_URL}&t=[${title}]`;
  const response = await fetch(url);

  return response.json();
}
