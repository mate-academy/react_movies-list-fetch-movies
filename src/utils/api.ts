export const API_URL = 'https://www.omdbapi.com/?apikey=1b552020&t=';

export async function getData(url: string) {
  const response = await fetch(url);

  return response.json();
}
