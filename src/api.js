const IMDB_API = 'https://www.omdbapi.com/?apikey=745602f5&t=';

export const fetchMovie = title => fetch(`${IMDB_API}${title}`)
  .then(promise => promise.json());
