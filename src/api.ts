const BASE_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=51858c6&t';

export const getMovie = async (title: string) => {
  const response = await fetch(`${BASE_URL}=[${title}]`);

  return response.json();
};
