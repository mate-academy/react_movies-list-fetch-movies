const BASE_URL = 'https://www.omdbapi.com/?apikey=37176dfa';

export async function getMovie(title: string) {
  const response = await fetch(`${BASE_URL}&t=${title}`);

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  return response.json();
}
