const BASE_URL = 'http://www.omdbapi.com/?apikey=5ba996a5&t=';

export const getMovie = async(title) => {
  const response = await fetch(`${BASE_URL}${title}`);

  if (!response.ok) {
    throw new Error(response.status, response.text);
  }

  return response.json();
};
