import { Movie, Options } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

const OPTIONS_MOVIE: Options = {
  NOT_APPLICABLE: 'N/A',
  DEFAULT_PHOTO: 'https://via.placeholder.com/360x270.png?text=no%20preview',
  DEFAULT_imdbUrl: 'https://www.imdb.com/title/',
};

export const PreperedNewMovie = ({
  Poster,
  Title,
  Plot,
  imdbID,
}: MovieData) => {
  const newMovie: Movie = {
    title: Title,
    description: Plot,
    imgUrl:
      Poster !== OPTIONS_MOVIE.NOT_APPLICABLE
        ? Poster
        : OPTIONS_MOVIE.DEFAULT_PHOTO,
    imdbUrl: `${OPTIONS_MOVIE.DEFAULT_imdbUrl}${imdbID}`,
    imdbId: imdbID,
  };

  return newMovie;
};

export const IsMoviesHaveNewMovie = (
  addedMovies: Movie[],
  NewMovieId: string,
) => addedMovies.find(movie => movie.imdbId === NewMovieId) || null;

export function debounce(
  callback: React.Dispatch<React.SetStateAction<string>>,
  delay: number,
): (arg: string) => void {
  let timerId: number;

  return (arg: string) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => callback(arg), delay);
  };
}
