const API_URL = 'https://www.omdbapi.com/?apikey=7c96957b&t=';

export const getMovie = async (query: string) => {
  const response = await fetch(`${API_URL}${query}`);

  return response.json();
};