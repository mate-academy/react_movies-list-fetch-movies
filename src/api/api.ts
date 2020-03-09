export const IMDB_URL = 'https://www.imdb.com/title/';

const MOVIES_URL = 'http://www.omdbapi.com/?apikey=c4ea428d&t=';

export const getMovie = (searchValue: string) => {
  return fetch(MOVIES_URL + searchValue)
    .then(response => {
      return response.json();
    });
};
