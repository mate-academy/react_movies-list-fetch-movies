
const IMDB_API = 'https://www.omdbapi.com/?apikey=e93182ee&t=';

export const fetchMovie = title => fetch(`${IMDB_API}${title}`)
  .then(response => response.json());
