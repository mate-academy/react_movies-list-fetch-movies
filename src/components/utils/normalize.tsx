import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';

export function normalizeMovieData(data: MovieData): Movie {
  return {
    imdbId: data.imdbID,
    title: data.Title,
    description: data.Plot,
    imgUrl: data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/360x270.png?text=no%20preview',
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
  };
}
