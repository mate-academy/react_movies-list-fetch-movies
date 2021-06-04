const BASE_URL = 'https://www.omdbapi.com/?apikey=388a6c41&t=';

export const getMovie = title => fetch(BASE_URL + title)
  .then(response => response.json());
