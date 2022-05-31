const API_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=d97e20ba';

export const getMovie = async (title: string) => {
  const response = await fetch(`${API_URL}&t=${title}`);

  return response.json();
};
