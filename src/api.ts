const API_URL = 'https://www.omdbapi.com';
const API_KEY = '70d4b0c2';

export const getMovie = (title: string) => {
  return fetch(`${API_URL}/?apikey=${API_KEY}&t=${title}`)
    .then(response => response.json());
};
