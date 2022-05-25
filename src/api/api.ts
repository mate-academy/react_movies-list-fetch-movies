const API_KEY = 'f0ea3cdc';
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export const getMovies = async (filter: string) => {
  const response = await fetch(`${BASE_URL}&t=${filter}`);

  return response.json();
};
