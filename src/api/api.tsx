const BASE_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=7a6c8562';

export const getMovie = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}&t=${endpoint}`);

  return response.json();
};
