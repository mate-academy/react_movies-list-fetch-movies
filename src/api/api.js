const BASE_URL = 'https://www.omdbapi.com/?apikey=d83d550f';

export const getMovies = title => fetch(`${BASE_URL}&t=${title}`)
  .then(res => res.json())
  .catch(error => error);
