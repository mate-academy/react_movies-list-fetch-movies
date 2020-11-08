const BASE_URL = 'http://www.omdbapi.com';
const KEY = '94797de1';

export const getMovie = title => (
  fetch(`${BASE_URL}/?apikey=${KEY}&t=${title}`)
    .then(response => response.json())
);
