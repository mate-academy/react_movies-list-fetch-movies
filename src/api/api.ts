export const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=886e5c53&t=';

export async function getMovie(title: string) {
  const response = await fetch(`${API_URL}${title}`);

  if (!response.ok) {
    throw new Error(`Status of error: ${response.status}`);
  }

  return response.json();
}
