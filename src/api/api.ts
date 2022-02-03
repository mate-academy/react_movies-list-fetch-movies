const BASE_URL = 'https://www.omdbapi.com';

export const findMovie = async (title: string) => {
  const response = await fetch(`${BASE_URL}/?apikey=13b8ae73&t=${title}`);

  return response.json();
};
