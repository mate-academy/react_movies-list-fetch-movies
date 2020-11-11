const BASE_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=fc4dff85';

export async function loadMovie(title) {
  const response = await fetch(`${BASE_URL}&t=[${title}]`);

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  const result = await response.json();

  return result;
}
