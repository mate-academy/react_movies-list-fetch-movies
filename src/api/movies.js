const MOVIES_URL = 'https://www.omdbapi.com/?apikey=384ef47d&t=';

export const getMovieByTitle = title => fetch(MOVIES_URL + title)
  .then(response => response.json());
