const BASE_URL = 'https://www.omdbapi.com/?apikey=';
const myKey = '7b37b3de';

export const getMovieByTitle = async (title: string) => {
  const response = await fetch(`${BASE_URL}${myKey}&t=${title}`);

  return response.json();
};
