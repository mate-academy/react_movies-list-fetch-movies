import { Movie } from './types/Movie';
import { ResponseError } from './types/ReponseError';

const API_KEY = '91eaadf3';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

type MoviePromise = Promise<Movie | ResponseError>;

export function getMovie(query: string): MoviePromise {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .then(movie => {
      if (!movie.imdbID) {
        throw new Error('Can\'t find a movie with such a title');
      }

      const {
        Title,
        Poster,
        Plot,
        imdbID,
      } = movie;

      return {
        title: Title,
        description: Plot,
        imgUrl: Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : Poster,
        imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        imdbId: imdbID,
      };
    })
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
