const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=e5d0e44d';

export const getMovies = async (title: string) => {
  const response = await fetch(`${API_URL}&t=[${title}]`);

  return response.json();
};
