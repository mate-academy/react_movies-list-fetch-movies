const API_URL = `https://www.omdbapi.com/?apikey=186aba00&t=`;

export const getMovie = async(query) => {
  const data = await fetch(`${API_URL}${query}`);
  const result = await data.json();

  return result;
};
