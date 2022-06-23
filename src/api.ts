const API_URL = 'https://www.omdbapi.com/?apikey=45ae581e';

export async function getMovie(title: string) {
  const response = await fetch(`${API_URL}&t=${title}`);

  return response.json();
}
