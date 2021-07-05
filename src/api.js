const API_URL = `https://www.omdbapi.com/?apikey=efe95d9&t=`;

export const getMovie = async(name) => {
  const response = await fetch(API_URL + name);

  return response.json();
};
