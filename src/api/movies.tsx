const BASE_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=9f56fe16';

export const getData = async (title:string) => {
  const response = await fetch(`${BASE_URL}&t=${title}`);
  const movieOb = await response.json();

  return movieOb;
};
