const BASE_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=257b4347&t';

export const getMovie = async (title: string) => {
  const response = await fetch(`${BASE_URL}=[${title}]`);

  return response.json();
};
