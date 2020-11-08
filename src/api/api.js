const BASE_URL = 'http://www.omdbapi.com';
const url = `${BASE_URL}/?apikey=106c9773`;

export const getMovie = title => fetch(`${url}&t=${title}`)
  .then(response => response.json());
