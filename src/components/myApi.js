const BASE_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=dc986d28';

export const request = (url, options) => fetch(`${BASE_URL}${url}`, options)
  .then(res => res.json())
  .catch(error => error);

export const getMovie = title => request(`&t=[${title}]`);
