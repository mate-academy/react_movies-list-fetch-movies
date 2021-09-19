export const API_URL = 'http://www.omdbapi.com/?apikey=4177f3f1&';

export const getMovie = async (title: string) => {
  const response = await fetch(`${API_URL}&t=${title}`);

  return response.json();
};
