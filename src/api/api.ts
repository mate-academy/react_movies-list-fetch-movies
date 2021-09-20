const API_URL = 'https://www.omdbapi.com/?apikey=b2947ed2';

export const getMovie = async (title: string) => {
  const response = await fetch(`${API_URL}&t=${title}`);

  return response.json();
};
