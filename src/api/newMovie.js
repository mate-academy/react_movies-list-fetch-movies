
const BASE_URL = 'https://www.omdbapi.com';

const request = (url, options) => fetch(`${BASE_URL}${url}`, options)
  .then(res => res.json());

export const getMovie = movieTitle => request(
  `/?apikey=20efd394&t=${movieTitle}`,
);
