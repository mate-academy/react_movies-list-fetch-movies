import {
  FC,
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { getMovieFromData } from '../../helpers';

type Props = {
  query: string,
  setQuery: Dispatch<SetStateAction<string>>,
  addMovie: () => void,
  newMovie: Movie | null,
  setNewMovie: Dispatch<SetStateAction<Movie | null>>,
};

export const FindMovie: FC<Props> = ({
  query,
  setQuery,
  addMovie,
  newMovie,
  setNewMovie,
}) => {
  const [hasError, setHasError] = useState(false);
  const [search, setSearch] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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
                {
                  'is-loading': search && !hasError,
                },
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
                onClick={addMovie}
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
