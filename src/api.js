const BASE_URL = 'https://www.omdbapi.com/?apikey=ebaa6af1';

export const fetchMovie = title => fetch(`${BASE_URL}&t=${title}`)
  .then(res => res.json());
