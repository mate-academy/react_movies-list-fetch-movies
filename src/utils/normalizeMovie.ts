import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

export function normalizeMovie(data: MovieData): Movie {
  return {
    imdbId: data.imdbID,
    title: data.Title,
    description: data.Plot,
    imgUrl: !data.Poster || data.Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : data.Poster,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}/`,
  };
}
