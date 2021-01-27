const BASE_URL = 'https://www.omdbapi.com/?apikey=8b4080ef&';

export const baseRequest = async(title = '') => {
  const response = await fetch(`${BASE_URL}t=${title}`);

  return response.json();
};
