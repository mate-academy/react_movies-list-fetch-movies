const BASE_URL = 'https://www.omdbapi.com/?apikey=cf59143c';

export const getMovie = async(title) => {
  const response = await fetch(`${BASE_URL}&t=${title}`);

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  return response.json();
};
