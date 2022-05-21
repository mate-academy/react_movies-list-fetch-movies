const myKey = '626f543c';
const API_URL = `https://www.omdbapi.com/?apikey=${myKey}`;

export const request = async (endpoint: string) => {
  const response = await fetch(`${API_URL}&t=${endpoint}`);

  return response.json();
};
