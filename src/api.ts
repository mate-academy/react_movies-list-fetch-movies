import { Movie } from './react-app-env';

const API = 'https://www.omdbapi.com/?i=tt3896198&apikey=73b9877c';

export const getFilmByTitle = (title: string): Promise<Movie> => {
  return fetch(`${API}&t=${title}`)
    .then(response => {
      return response.json();
    });
};
