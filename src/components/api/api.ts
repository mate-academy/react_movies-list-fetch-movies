const BASE_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=e5addb44&';

export const getMovies = async (title: string) => {
  const response = await fetch(`${BASE_URL}t=${title}`);

  return response.json();
};
