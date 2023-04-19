import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie, getMovieFromData } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  newMovie: Movie | null;
  setNewMovie: Dispatch<SetStateAction<Movie | null>>;
  onAddMovie: () => void;
};

export const FindMovie: React.FC<Props> = ({
  query,
  setQuery,
  newMovie,
  setNewMovie,
  onAddMovie,
}) => {
  const [hasError, setHasError] = useState(false);
  const [search, setSearch] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setHasError(false);
    setSearch(true);

    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          return Promise.reject();
        }

        const parsedMovie = getMovieFromData(response);

        return setNewMovie(parsedMovie);
      })
      .catch(() => setHasError(true));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHasError(false);

    setQuery(event.target.value);
  };

  useEffect(() => {
    setSearch(false);
  }, [newMovie, query]);

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
              onChange={handleChange}
            />
          </div>

          {hasError && (
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
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': search && !hasError },
                { 'is-danger': hasError },
              )}
              disabled={!query}
            >
              {!newMovie
                ? 'Find a movie'
                : 'Search Again'}
            </button>
          </div>

          <div className="control">
            {newMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAddMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {newMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={newMovie} />
        </div>
      )}
    </>
  );
};
