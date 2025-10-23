import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

const DEFAULT_POSTER =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export function mapMovieData(data: MovieData): Movie {
  const hasPoster = data.Poster && data.Poster !== 'N/A';

  return {
    title: data.Title,
    description: data.Plot,
    imgUrl: hasPoster ? data.Poster : DEFAULT_POSTER,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  };
}
