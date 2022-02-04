const API_URL = 'https://www.omdbapi.com/?apikey=c256229b&t=';

export async function getMovie(title: string) {
  const response = await fetch(`${API_URL}${title}`);

  return response.json();
}
