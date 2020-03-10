export const API_URL = 'https://www.omdbapi.com/?apikey=2f56ed46&t='

export const getData = async (url: string) => {
  const response = await fetch(url);

  return response.json();
}
