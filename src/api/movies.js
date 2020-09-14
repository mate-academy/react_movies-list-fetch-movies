const MOVIES__URL = 'https://www.omdbapi.com/?t=';
const key = 'apikey=95d81992';

export const getMovie = title => fetch(`${MOVIES__URL}${title}&${key}`)
  .then(response => response.json());
