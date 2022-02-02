const BASE_URL = 'http://www.omdbapi.com/';
const apiKey = 'cf4cfe8c';

export const getMovie = (title: string) => {
  return fetch(`${BASE_URL}?apikey=${apiKey}&t=${title}`)
    .then(response => response.json())
    .catch(error => {
      // eslint-disable-next-line no-console
      console.warn('Error:', error);
    });
};
