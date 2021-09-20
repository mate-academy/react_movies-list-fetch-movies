const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=c01d3eb8&';

export const getMovie = async (title: string) => {
  const response = await fetch(`${API_URL}&t=${title}`);

  return response.json();
};
