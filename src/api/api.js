const BASE_URL = `https://www.omdbapi.com/?apikey=8424f04f&t=`;

export const getMovie = async(title) => {
  const response = await fetch(`${BASE_URL}${title}`);

  return response.json();
};
