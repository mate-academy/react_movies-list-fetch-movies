import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=eec79111';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}

export const normalizeMovieData = (rawData: MovieData): Movie => {
  return {
    title: rawData.Title,
    description: rawData.Plot,
    imdbId: rawData.imdbID,
    imgUrl: rawData.Poster !== 'N/A'
      ? rawData.Poster
      : 'https://via.placeholder.com/360x270.png?text=no%20preview',
    imdbUrl: `https://www.imdb.com/title/${rawData.imdbID}`,
  };
};
