import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=ab484a41';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}

export const getMovieFromData = ({
  Title,
  Plot,
  Poster,
  imdbID,
}: MovieData) => ({
  title: Title,
  description: Plot,
  imgUrl: Poster === 'N/A'
    ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
    : Poster,
  imdbUrl: `https://www.imdb.com/title/${imdbID}`,
  imdbId: imdbID,
});
