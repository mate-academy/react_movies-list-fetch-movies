const BASE_URL = 'http://www.omdbapi.com/?apikey=a0e39ca2&t=';

export const getMovie = title => fetch(`${BASE_URL}${title}`)
  .then(response => response.json());
