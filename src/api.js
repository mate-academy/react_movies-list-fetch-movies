const BASE_URL = 'https://www.omdbapi.com';
const key = '885b5a27';

export const getMovie = title => fetch(`${BASE_URL}/?apikey=${key}&t=${title}`)
  .then(response => response.json());
