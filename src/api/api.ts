const BASE_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=602f3d88';

export const getMovie = async (title: string) => {
  const request = await fetch(`${BASE_URL}&t=${title}`);

  return request.json();
};
