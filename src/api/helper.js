const BASE_URL = 'https://www.omdbapi.com/?apikey=6ce2caab&t=';

export const getMovie = async(url) => {
  const response = await fetch(`${BASE_URL}${url}`);

  return response.json();
};
