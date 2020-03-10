const API_URL = 'https://www.omdbapi.com/?apikey=7c96957b&t=';

export const IMDB_URL = 'https://www.imdb.com/title/';

export const getMovie = (searchValue: string) => {
  return fetch(API_URL + searchValue)
    .then(movieFromServer => {
      return movieFromServer.json();
    });
};
