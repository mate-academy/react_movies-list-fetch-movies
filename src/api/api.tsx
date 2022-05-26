const key = '626f543c';
const API_URL = `http://www.omdbapi.com/?apikey=${key}`;

export const request = async (endpoint: string) => {
  const response = await fetch(`${API_URL}&t=${endpoint}`);

  return response.json();
};
