const GET_MOVIE_API = 'https://www.omdbapi.com/?apikey=dc7441d9&t=';

export const getMovieByTitle = (title: string): Promise<Movie> => {
  return fetch(`${GET_MOVIE_API}${title}`)
    .then(responce => responce.json())
    .then(responce => {
      if (responce.Error) {
        return undefined;
      }

      return responce;
    });
};
