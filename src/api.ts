import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=c5e2348d';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}

export function normalizeMovieData(movieData: MovieData): Movie {
  return {
    title: movieData.Title,
    description: movieData.Plot,
    imgUrl: movieData.Poster !== 'N/A'
      ? movieData.Poster
      : 'https://via.placeholder.com/360x270.png?text=no%20preview',
    imdbId: movieData.imdbID,
    imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
  };
}
