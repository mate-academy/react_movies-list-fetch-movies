/* eslint-disable arrow-body-style */
const BASE_URL = 'https://www.omdbapi.com/';

export const getMovies = (title) => {
  return fetch(`${BASE_URL}?apikey=85ae2db4&t=${title}`)
    .then(response => response.json());
};
