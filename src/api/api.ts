const API_URL = 'https://www.omdbapi.com/?apikey=c1b7204a';

export const loadMovies = async (title: string) => {
  const response = await fetch(`${API_URL}&t=[${title}]`);

  return response.json();
};
