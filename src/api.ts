const API_URL = 'http://www.omdbapi.com/?apikey=6279e07f&t=';

export async function getMovie(title: string) {
  const response = await fetch(`${API_URL}${title}`);

  return response.json();
}
