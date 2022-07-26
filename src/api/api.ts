const API_KEY = 'fe759ad0';
const BASE_URL = 'https://www.omdbapi.com/';

const request = async (url: string) => {
  return (await fetch(`${BASE_URL}${url}`)).json();
};

export const getMovie = (title: string) => {
  const api = `?apikey=${API_KEY}&`;
  const titleQuery = `&t=${title}`;

  return request(`${api}${titleQuery}`);
};
