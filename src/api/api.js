const BASE_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=d83d550f';

export const getMovies = title => fetch(`${BASE_URL}&t=${title}`)
  .then(res => res.json())
  .catch(error => error);
