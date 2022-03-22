const MOVIE_URL = 'https://www.omdbapi.com/?apikey=[yourkey]&t=';

export const getMovie = (title: string) => {
  return fetch(`${MOVIE_URL}${title}`)
    .then(responce => responce.json());
};
