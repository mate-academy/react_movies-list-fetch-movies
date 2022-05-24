const BASE_URL = 'http://www.omdbapi.com/?apikey=7a6c8562';

export const getMovie = async (endpoint: string) => {
  const request = await fetch(`${BASE_URL}&t=${endpoint}`);

  return request.json();
};
