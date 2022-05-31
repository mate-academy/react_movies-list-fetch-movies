const key = '3d12c401';
const API_URL = `https://www.omdbapi.com/?apikey=${key}`;

export const request = async (endpoint: string) => {
  const response = await fetch(`${API_URL}&t=${endpoint}`);

  return response.json();
};
