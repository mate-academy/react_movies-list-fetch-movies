const BASE_URL = 'http://www.omdbapi.com/?apikey=ebaa6af1';

export const fetchMovie = title => fetch(`${BASE_URL}&t=${title}`)
  .then(res => res.json());
