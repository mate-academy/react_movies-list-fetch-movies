import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=26ac10d7';

export function getMovie(query: string): Promise<Movie | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => {
      if (res.status !== 200) {
        throw new Error('Please try later');
      }

      return res.json();
    })
    .then((res: MovieData) => {
      if ('Error' in res) {
        return Promise.reject({ message: res.Error, success: false });
      }

      const newMovie = {
        title: res.Title,
        description: res.Plot,
        imgUrl: res.Poster,
        imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
        imdbId: res.imdbID,
      };

      return newMovie;
    })
    .catch(() => {
      throw new Error('Something went wrong');
    });
}
