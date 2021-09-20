const API_URL = 'https://www.omdbapi.com/?apikey=4d27a21e';

export const getMovie = async (title: string) => {
  const response = await fetch(`${API_URL}&t=${title}`);

  return response.json();
};
