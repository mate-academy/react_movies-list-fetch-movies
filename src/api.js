const BASE_URL = 'https://www.omdbapi.com/?apikey=ff37ac41&t=;';

export const getMovie = value => fetch(BASE_URL + value)
  .then(response => response.json());
