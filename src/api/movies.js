const BASE_URL = 'https://www.omdbapi.com/?apikey=b6667533';

export const getMovie = async(title) => {
  const response = await fetch(`${BASE_URL}&t=${title}`);

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  return response.json();
};
