const API_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=1b498e6e&';

export const getMovies = async (title: string) => {
  const response = await fetch(`${API_URL}t=${title}`);

  return response.json();
};
