const BASE_URL = 'https://www.omdbapi.com/?apikey=b83e4f60';

export const getMovie = async(movTitle) => {
  const response = await fetch(`${BASE_URL}&t=${movTitle}`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};
