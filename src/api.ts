import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=f68e39dd';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}

export function normalizeData(data: MovieData): Movie {
  const {
    Poster,
    Title,
    Plot,
    imdbID,
  } = data;

  const poster = Poster === 'N/A'
    ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
    : Poster;

  return {
    title: Title,
    description: Plot,
    imgUrl: poster,
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
    imdbId: imdbID,
  };
}
