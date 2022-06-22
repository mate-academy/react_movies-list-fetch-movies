const API = 'https://www.omdbapi.com/?apikey=a704b4ff';

export const getMovie = (title: string): Promise<Movie> => {
  return fetch(`${API}&t=${title}`)
    .then(response => response.json())
    .then(result => {
      if (result.Response === 'False') {
        throw new Error('some error');
      }

      return result;
    });
};
