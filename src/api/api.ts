const BASE_URL = 'https://www.omdbapi.com/?apikey=e368ee7c';

export const getMovieRequest = async (movieTitle: string) => {
  const response = await fetch(`${BASE_URL}&t=${movieTitle}`);

  return response.json();
};
