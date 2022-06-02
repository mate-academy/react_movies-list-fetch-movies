const BASE_URL = 'https://www.omdbapi.com/?i=tt0098936&apikey=85369871&';

export const getMovies = async (title: string) => {
  const response = await fetch(`${BASE_URL}t=${title}`);

  return response.json();
};
