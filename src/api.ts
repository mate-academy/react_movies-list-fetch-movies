import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ResponseError';
import { Movie } from './types/Movie';

const API_URL = 'https://www.omdbapi.com/?apikey=932e507';
const PLACEHOLDER = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export function getMovieInfo(imdbData: MovieData): Promise<Movie> {
  return fetch(`${API_URL}&i=${imdbData.imdbID}`)
    .then(res => {
      return res.json();
    })
    .then((data: MovieData) => ({
      title: data.Title,
      description: data.Plot,
      imgUrl: data.Poster === 'N/A' || !data.Poster ? PLACEHOLDER : data.Poster,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imdbId: data.imdbID,
    }));
}

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${encodeURIComponent(query)}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Network error');
      }

      return res.json();
    })
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}

export function isError(
  data: MovieData | ResponseError,
): data is ResponseError {
  return (data as ResponseError).Response === 'False';
}
