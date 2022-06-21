const BASE_URL = 'https://www.omdbapi.com/?apikey=2d2038e9&?';

export async function request(title : string) {
  const result = await (await fetch(`${BASE_URL}&t=${title}`)).json();

  return result;
}
