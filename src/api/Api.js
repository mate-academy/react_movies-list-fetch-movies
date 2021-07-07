const BASE_URL = 'https://www.omdbapi.com/?apikey=5d0c644';

export const fetchMovie = title => fetch(`${BASE_URL}&t=${title}`)
  .then(response => response.json());
