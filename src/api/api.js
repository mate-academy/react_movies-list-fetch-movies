const url = 'https://www.omdbapi.com/?apikey=d8450d83&t=';

export const getMovie = query => fetch(`${url}${query}`)
  .then(response => response.json(), error => error);
