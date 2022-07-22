const API_KEY = 'fe759ad0';
const BASE_URL = 'http://www.omdbapi.com/';

const request = async (url: string) => {
  return fetch(`${BASE_URL}${url}`)
    .then(response => response.json());
};

export const getMovie = async (title: string) => {
  const api = `?apikey=${API_KEY}&`;
  const titleQuery = `&t=${title}`;

  return request(`${api}${titleQuery}`);
};
