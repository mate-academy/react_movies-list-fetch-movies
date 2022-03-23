const BASE_URL = 'https://www.omdbapi.com/?apikey=afe9ef49&t=';

export async function getMovie(title: string) {
  const response = await fetch(`${BASE_URL}${title}`);

  if (!response) {
    throw new Error('NONE');
  }

  return response.json();
}
