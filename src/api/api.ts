const API_URL = 'https://www.omdbapi.com';
const API_KEY = '359b5608';

export const getMovie = (title: string) => {
  return fetch(`${API_URL}/?apikey=${API_KEY}&t=${title}`)
    .then(response => response.json());
};
