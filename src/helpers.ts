import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';

// eslint-disable-next-line max-len
const defaultImgUrl = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const getNormalizedMovie = (movie: MovieData): Movie => ({
  title: movie.Title,
  description: movie.Plot,

  imgUrl: movie.Poster !== 'N/A'
    ? movie.Poster
    : defaultImgUrl,

  imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
  imdbId: movie.imdbID,
});
