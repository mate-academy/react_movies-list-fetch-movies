import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

export function normalizeMovie(data: MovieData): Movie {
  return {
    imdbId: data.imdbID,
    title: data.Title,
    description: data.Plot,
    imgUrl: data.Poster !== 'N/A' ? data.Poster : 'images/no-poster.png',
    imdbUrl: 'https://www.imdb.com/title/${data.imdbID}/',
  };
}
