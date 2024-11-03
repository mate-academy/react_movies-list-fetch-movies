import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

export const transformMovieData = ({
  Poster,
  Title,
  Plot,
  imdbID,
}: MovieData): Movie => ({
  title: Title,
  description: Plot,
  imgUrl:
    Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : Poster,
  imdbUrl: `https://www.imdb.com/title/${imdbID}`,
  imdbId: imdbID,
});
