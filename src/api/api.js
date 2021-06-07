const BASE_URL = 'https://www.omdbapi.com/?apikey=d1a462a4&t=';

export const getFilm = title => fetch(BASE_URL + title)
  .then(res => res.json());
