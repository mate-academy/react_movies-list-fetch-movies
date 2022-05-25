const URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=';
const KEY = '9d4d899a';

export const getMovies = async (endpoint: string) => {
  const response = await fetch(`${URL}${KEY}&t=${endpoint}`);

  return response.json();
};
