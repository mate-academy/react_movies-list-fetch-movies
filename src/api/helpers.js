const BASE_URL = 'http://www.omdbapi.com/?apikey=41fc156d&t=';

export const request = url => fetch(`${BASE_URL}${url}`)
  .then(response => response.json())
  .catch(error => error);
