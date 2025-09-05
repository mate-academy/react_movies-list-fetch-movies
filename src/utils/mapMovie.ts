import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

const DEFAULT_POSTER =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export const mapMovie = (data: MovieData): Movie => ({
  imgUrl: data.Poster !== 'N/A' ? data.Poster : DEFAULT_POSTER,
  title: data.Title,
  description: data.Plot,
  imdbId: data.imdbID,
  imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
});
