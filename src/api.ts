const BASE_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=35f6efbf';

export const searchMovie = async (title: string) => {
  const request = await fetch(`${BASE_URL}&t=${title}`);

  return request.json();
};
