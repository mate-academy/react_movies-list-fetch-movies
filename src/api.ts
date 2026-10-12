import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=e6ee143';

export function normalizeMovie(movie: MovieData): Movie {
  return {
    title: movie.Title,
    description: movie.Plot,
    imgUrl: movie.Poster,
    imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
    imdbId: movie.imdbID,
  };
}

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
