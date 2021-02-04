const URL = 'https://www.omdbapi.com/?apikey=37e52d7c&t=';

export const findMovie = param => fetch(`${URL}${param}`)
  .then(response => response.json())
  .then(result => result);
