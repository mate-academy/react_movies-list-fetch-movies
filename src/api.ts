const API_URL = 'https://www.omdbapi.com/?apikey=b2241fd4&t=';

export const getMovie = async (movieTitle: string) => {
  const response = await fetch(`${API_URL}${movieTitle}`);

  return response.json();
};
