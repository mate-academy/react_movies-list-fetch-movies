
const API_URL = 'http://www.omdbapi.com/?apikey=af43bc31&t=';

export async function getMovie(title) {
  const response = await fetch(`${API_URL}${title}`);

  return response.json();
}
