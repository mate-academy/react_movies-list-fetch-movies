const API_KEY = '605e0ff4';
const BASE_URL = 'http://www.omdbapi.com/?apikey=';

export const getMovie = async(title) => {
  const url = `${BASE_URL}${API_KEY}&t=${title}`;

  const response = await fetch(url);

  return response.json();
};
