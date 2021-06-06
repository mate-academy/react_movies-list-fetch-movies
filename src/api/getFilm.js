const BASE_URL = 'https://www.omdbapi.com/?apikey=e3ae5d03&t=';

export const getFilm = filmTitle => fetch(`${BASE_URL}${filmTitle}`)
  .then(response => response.json());
