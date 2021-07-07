const API_URL = 'https://www.omdbapi.com/?apikey=4535c7b3&t=';

export const getMovie = title => fetch(`${API_URL}${title}`)
  .then(promise => promise.json());
