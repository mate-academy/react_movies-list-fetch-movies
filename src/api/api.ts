export const IMDB_URL = 'https://www.imdb.com/title/';

const MOVIES_URL = 'https://www.omdbapi.com/?apikey=c4ea428d&t=';

export const getMovie = (searchValue: string): Promise<MovieFromServer> => {
  return fetch(MOVIES_URL + searchValue)
    .then(response => {
      return response.json();
    });
};
