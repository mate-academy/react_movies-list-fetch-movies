// eslint-disable-next-line
export const getMovie = title => fetch(`http://www.omdbapi.com/?apikey=aa871ce9&t=${title}`)
  .then(response => response.json());
// eslint-disable-next-line
