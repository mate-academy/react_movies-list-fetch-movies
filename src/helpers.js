const BASE_URL = 'http://www.omdbapi.com/?apikey=8b4080ef&';

const POSTER_URL = 'http://img.omdbapi.com/?apikey=8b4080ef&';

export const baseRequest = async(title = '') => {
  const response = await fetch(`${BASE_URL}t=${title}`);

  return response.json();
};

export const posterRequest = async(url) => {
  const response = await fetch(`${POSTER_URL}${url}`);

  return response.json();
};
