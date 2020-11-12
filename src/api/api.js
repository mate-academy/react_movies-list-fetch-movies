const BASE_URL = 'https://www.omdbapi.com/?apikey=52d8d4e6';

export async function getMovie(title) {
  const response = await fetch(`${BASE_URL}&t=[${title}]`);

  const result = await response.json();

  if (result.Response === 'False') {
    throw new Error(`No movie found. Please choose another one!`);
  }

  return result;
}
