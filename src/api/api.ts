const URL = 'https://www.omdbapi.com/?apikey=dc7441d9&t=';

export const getMovie = (title: string): Promise<Movie> => {
  return fetch(`${URL}${title}`)
    .then(response => response.json())
    .then(response => {
      if (response.Error) {
        return undefined;
      }

      return response;
    });
};
