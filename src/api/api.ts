const API_URL = ' https://www.omdbapi.com/?i=tt3896198&apikey=1baacbe';

export const getMovie = async (endpoint: string) => {
  const response = await fetch(`${API_URL}&t=${endpoint}`);

  return response.json();
};
