const BASE_URL = 'https://www.omdbapi.com/?apikey=a9946729';

export const getMovie = async(url) => {
  const response = await fetch(`${BASE_URL}&t=${url}`);

  return response.json();
};
