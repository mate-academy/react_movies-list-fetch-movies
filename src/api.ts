const BASE_URL = 'http://www.omdbapi.com/';
const API_KEY = '2642b950';

export const request = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  const data = await response.json();

  if (data.Response === 'False') {
    return null;
  }

  return data;
};

export const getMovie = async (title: string) => {
  return request(`/?apikey=${API_KEY}&t=${title}`);
};
