// eslint-disable-next-line
export const getResponse = title => fetch(`//www.omdbapi.com/?apikey=aa871ce9&t=${title}`)
  .then(response => response.json());
// eslint-disable-next-line
