const MOVIE_URL = 'https://www.omdbapi.com/?apikey=afe9ef49&t=';

export const getMovie = (title: string): Promise<Movie> => {
  return fetch(`${MOVIE_URL}${title}`)
    .then(responce => responce.json())
    .then(responce => {
      if (responce.Error) {
        return '';
      }

      return responce;
    });
};
