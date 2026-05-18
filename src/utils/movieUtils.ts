import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';
import { FALLBACK_POSTER } from '../constants';

export const toMovie = (data: MovieData): Movie => ({
  title: data.Title,
  description: data.Plot,
  imgUrl: data.Poster !== 'N/A' ? data.Poster : FALLBACK_POSTER,
  imdbId: data.imdbID,
  imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
});
