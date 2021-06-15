// eslint-disable-next-line
export const getMovie = title => fetch(`https://www.omdbapi.com/?apikey=43477d2c&t=${title}`)
  .then(response => response.json());
