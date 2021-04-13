const BASE_URL = 'https://www.omdbapi.com/?apikey=882a3426&t=';

const request = url => (
  fetch(`${BASE_URL}${url}`)
    .then(response => response.json())
);

export const getMovie = film => request(film);
