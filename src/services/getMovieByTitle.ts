import { MovieData } from '../types/MovieData';
import { ResponseError } from '../types/ReponseError';

const BASE_URL = 'https://www.omdbapi.com/?apikey=f23808d&t=';

function getMovieByTitle(title: string) {
  return fetch(BASE_URL + title)
    .then(response => {
      return response.json() as Promise<MovieData | ResponseError>;
    });
}

export default getMovieByTitle;
