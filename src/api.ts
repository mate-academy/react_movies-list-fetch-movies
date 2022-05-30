const key = '9e088334';
const API_URL = `https://www.omdbapi.com/?apikey=${key}`;

export const getMovies = async (title: string) => {
  const response = await fetch(`${API_URL}&t=${title}`);

  return response.json();
};
