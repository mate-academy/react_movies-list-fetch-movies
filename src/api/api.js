const API_URL = `https://www.omdbapi.com/?apikey=2067d7db&t`;

export async function getMovie(title) {
  const response = await fetch(`${API_URL}=${title}`);

  return response.json();
}
