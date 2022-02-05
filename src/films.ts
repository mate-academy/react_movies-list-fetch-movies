const API_URL = 'https://www.omdbapi.com/?apikey=dae73c3e&t=';

export async function getFilm(film: string) {
  const response = await fetch(`${API_URL}${film}`);

  if (response.ok) {
    return response.json();
  }

  return new Error(`${response.status}: ${response.text}`);
}
