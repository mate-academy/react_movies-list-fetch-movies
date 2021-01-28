const BASE_URL = 'http://www.omdbapi.com/?';

export const getMovie = query => fetch(`${BASE_URL}t=${query}&apikey=214049a0`)
  .then(response => response.json());
