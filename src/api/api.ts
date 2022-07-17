import { Movie } from '../react-app-env';

const API_URL = ' https://www.omdbapi.com/?apikey=830ad734&t=';

export function getMovie(title: string) :Promise<Movie> {
  return fetch(`${API_URL}${title}`)
    .then(response => response.json());
}
