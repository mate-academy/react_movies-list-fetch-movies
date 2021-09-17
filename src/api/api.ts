const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=d2fc13e4';

export const loadMovie = async (title: string) => {
  const response = await fetch(`${API_URL}&t=${title}`);

  return response.json();
};
