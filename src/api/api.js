const BASE_URL = 'https://www.omdbapi.com/?apikey=317c681f&t=';

export const getMovie = async(query) => {
  const response = await fetch(`${BASE_URL}${query}`);

  return response.json();
};
