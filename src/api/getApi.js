const BASE_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=2d72ae97';

export const request = url => fetch(`${BASE_URL}&t=${url}`)
  .then(res => res.json());
