const BASE_URL = 'http://www.omdbapi.com';
const key = '/?apikey=7ff53734&t';

export async function getMovie(title: string) {
  const response = await fetch(`${BASE_URL}${key}=${title}`);

  return response.json();
}
