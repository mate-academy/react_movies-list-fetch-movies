const BASE_URL = 'https://www.omdbapi.com';
const API_KEY = '746d0f7';

export const request = async (endpoint: string) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await response.json();

    if (data.Response === 'False') {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
};

export const getMovie = (title: string) => request(`/?apikey=${API_KEY}&t=${title}`);
