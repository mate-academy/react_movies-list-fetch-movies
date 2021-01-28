export const getMovie = apiAdress => fetch(apiAdress)
  .then(response => response.json());
