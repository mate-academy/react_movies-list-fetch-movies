const BASE_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=2d3b5cf4';

export const getMovie = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}&t=${endpoint}`);

  return response.json();
};
