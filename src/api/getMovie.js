const URL = `https://www.omdbapi.com/?apikey=85d016e4&t=`;

export const getMovie = async(query) => {
  const response = await fetch(`${URL}${query}`);

  return response.json();
};
