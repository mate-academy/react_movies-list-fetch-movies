const BASE_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=91e17a04&t=';

export const getMovie = (movieTitle) => {
  return fetch(`${BASE_URL}${movieTitle}`)
    .then(response => response.json());
};
