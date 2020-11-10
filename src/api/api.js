const BASE_URL = `http://www.omdbapi.com/?apikey=2488e367`;

export async function getMovie(title) {
  const response = await fetch(`${BASE_URL}&t=[${title}]`);
  const result = await response.json();

  return result;
}
