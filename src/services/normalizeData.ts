import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

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
