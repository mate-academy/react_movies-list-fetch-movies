const BASE_URL = 'https://www.omdbapi.com/?apikey=257b4347';

export const getMovie = async (title: string) => {
  const response = await fetch(`${BASE_URL}&t=${title}`);

  return response.json();
};
