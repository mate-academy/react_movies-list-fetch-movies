const URL = 'https://www.omdbapi.com/?apikey=84ff36d=';

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
