const url = 'https://www.omdbapi.com/?i=tt3896198&apikey=19d6621e&t=';

export const getFilms = title => fetch(`${url}${title}`)
  .then(promise => promise.json());
