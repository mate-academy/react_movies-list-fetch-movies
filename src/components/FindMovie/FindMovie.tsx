import {
  FC,
  FormEvent,
  useCallback,
  useState,
} from 'react';
import classNames from 'classnames';
import './FindMovie.scss';

import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface FindMovieProps {
  addMovie: (movie: Movie) => void;
}

const FILM_URL = 'https://www.imdb.com/title';
// eslint-disable-next-line max-len
const DEFAULT_PICTURE = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: FC<FindMovieProps> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [hasError, setError] = useState(false);
  const [isFindedFilm, setIsFindedFilm] = useState(false);
  const [isSubmitedForm, setSubmitedForm] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const changeQuery = (queryFromUser: string) => {
    setQuery(queryFromUser);
    setError(false);
  };

  const loadMoviesFromServer = useCallback(async (queryFromUser) => {
    const movieFromServer = await getMovie(queryFromUser);

    if ('Error' in movieFromServer) {
      setError(true);
      setSubmitedForm(false);

      return;
    }

    const {
      Title,
      Plot,
      imdbID,
      Poster,
    } = movieFromServer;

    setMovie({
      title: Title,
      description: Plot,
      imgUrl: Poster === 'N/A' ? DEFAULT_PICTURE : Poster,
      imdbUrl: `${FILM_URL}/${imdbID}`,
      imdbId: imdbID,
    });
    setIsFindedFilm(true);
    setSubmitedForm(false);
  }, []);

  const handleSubmitFindMovie = (event: FormEvent) => {
    event.preventDefault();
    loadMoviesFromServer(query);
    setSubmitedForm(true);
  };

  const handleButtonAddMovie = () => {
    if (movie) {
      addMovie(movie);
      setIsFindedFilm(false);
      setMovie(movie);
      setQuery('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmitFindMovie}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
              value={query}
              onChange={(event) => changeQuery(event.target.value)}
            />
          </div>

          {hasError
          && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isSubmitedForm,
              })}
              disabled={!query}
            >
              {isFindedFilm
                ? 'Search again'
                : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {isFindedFilm && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleButtonAddMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {isFindedFilm
      && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
