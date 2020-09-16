const MOVIE_URL = 'https://www.omdbapi.com';

export const getMovie = query => fetch(`
  ${MOVIE_URL}/?apikey=a3e459cc&t=${query}
`)
  .then(response => response.json());
