const API_URL = 'https://www.omdbapi.com/?apikey=';
const API_KEY = '1280e2f';

export const loadMovie = async(query) => {
  const response = await fetch(`${API_URL}${API_KEY}&t=${query}`);

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  return response.json();
};
