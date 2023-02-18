import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

// eslint-disable-next-line max-len
const defaultImgUrl = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const getNormalizeMovie = ({
  Title,
  Plot,
  Poster,
  imdbID,
}: MovieData): Movie => ({
  title: Title,
  description: Plot,
  imgUrl: Poster === 'N/A' ? defaultImgUrl : Poster,
  imdbId: imdbID,
  imdbUrl: `https://www.imdb.com/title/${imdbID}`,
});
