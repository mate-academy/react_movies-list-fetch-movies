const key = '5ad7b015';

const API_URL = 'https://www.omdbapi.com/';

export const getMovie = async (title: string) => {
  const response = await fetch(`${API_URL}?apikey=${key}&t=${title}`);

  return response.json();
};
