import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

const DEFAUT_POSTER_IMG = 'https://via.placeholder.com/'
  + '360x270.png?text=no%20preview';
const MOVIE_IMDB_URL = 'https://www.imdb.com/title/';

export const createMovieFromData = ({
  Title,
  Poster,
  Plot,
  imdbID,
}: MovieData) => {
  const newMovie: Movie = {
    title: Title,
    description: Plot,
    imgUrl: Poster === 'N/A'
      ? DEFAUT_POSTER_IMG
      : Poster,
    imdbUrl: `${MOVIE_IMDB_URL}${imdbID}`,
    imdbId: imdbID,
  };

  return newMovie;
};
