const BASE_URL = 'https://www.omdbapi.com/?apikey=b753e75f';

export const getMovies = title => fetch(`${BASE_URL}&t=${title}`)
  .then(response => response.json())
  .catch(error => error);
