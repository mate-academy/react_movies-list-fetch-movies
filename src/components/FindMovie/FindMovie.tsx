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
import { DEFAULT_PICTURE, FILM_URL } from '../../defaultUrl';
import { Error } from '../../types/ErrorEnum';

interface FindMovieProps {
  addMovie: (movie: Movie) => void;
}

const renderSwitch = (err: string) => {
  switch (err) {
    case Error.EMPTY:
      return Error.EMPTY;
    case Error.FIND:
      return Error.FIND;
    default:
      return Error.NONE;
  }
};

export const FindMovie: FC<FindMovieProps> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [typeOfError, setTypeOfError] = useState(Error.NONE);
  const [isSubmitedForm, setSubmitedForm] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const changeQuery = (queryFromUser: string) => {
    setQuery(queryFromUser);
    setTypeOfError(Error.NONE);
  };

  const loadMoviesFromServer = useCallback(async (queryFromUser) => {
    if (!queryFromUser.trim()) {
      setTypeOfError(Error.EMPTY);
      setSubmitedForm(false);
      setQuery('');

      return;
    }

    const movieFromServer = await getMovie(queryFromUser);

    if ('Error' in movieFromServer) {
      setTypeOfError(Error.FIND);
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

    setSubmitedForm(false);
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitedForm(true);
    loadMoviesFromServer(query);
  };

  const handleAddMovie = () => {
    if (movie) {
      addMovie(movie);
      setMovie(null);
      setQuery('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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

          {typeOfError && (
            <p className="help is-danger" data-cy="errorMessage">
              {renderSwitch(typeOfError)}
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
              {movie
                ? 'Search again'
                : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
