import { MovieData } from './types/MovieData';
import { Movie } from './types/Movie';

const DEFAULT_IMG_URL
  = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const dataToMovie = ({
  Title,
  Plot,
  Poster,
  imdbID,
}: MovieData): Movie => ({
  title: Title,
  description: Plot,
  imgUrl: Poster !== 'N/A'
    ? Poster
    : DEFAULT_IMG_URL,
  imdbId: imdbID,
  imdbUrl: `https://www.imdb.com/title/${imdbID}`,
});
