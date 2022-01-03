const BASE_URL = 'https://www.omdbapi.com/?apikey=b5c7a9f6&t=';

export async function getMovie(title: string) {
  const response = await fetch(`${BASE_URL}${title}`);

  return response.json();
}
