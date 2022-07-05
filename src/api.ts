import { Movie } from './react-app-env';

const API_URL = 'http://www.omdbapi.com/?apikey=f47357f5&t=';

export function getMovies(title: string): Promise<Movie> {
  return fetch(`${API_URL}${title}`)
    .then(response => response.json());
}
