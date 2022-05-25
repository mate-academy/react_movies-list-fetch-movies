const BASE_URL = 'http://www.omdbapi.com/?apikey=';
const MY_KEY = '862ec5ec';

const request = async (url: string, myKey: string, title: string) => {
  const response = await fetch(`${url}${myKey}&t=${title}`);

  return response.json();
};

export const getMovie = (title: string) => request(BASE_URL, MY_KEY, title);
