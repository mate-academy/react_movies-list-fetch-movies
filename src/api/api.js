const URL_API = 'https://www.omdbapi.com/?apikey=745602f5&t=';

export const fetchMovie = title => fetch(`${URL_API}${title}`)
  .then(promise => promise.json());
