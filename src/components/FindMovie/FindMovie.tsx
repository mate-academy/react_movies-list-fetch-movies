import classNames from 'classnames';
import React, {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useState,
} from 'react';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  movie: Movie | null;
  onFindMovie: (query: string) => void;
  onAddMovie: () => void;
  isLoading: boolean;
  isError: boolean;
  changeLoading: (value: boolean) => void;
  changeError: (value: boolean) => void;
};

export const FindMovie: React.FC<Props> = ({
  movie,
  onFindMovie,
  onAddMovie,
  isLoading,
  isError,
  changeLoading,
  changeError,
}) => {
  const [query, setQuery] = useState('');

  const onChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    if (isError) {
      changeError(false);
    }

    setQuery(e.target.value);
  };

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    changeLoading(true);
    onFindMovie(query);
  };

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    onAddMovie();
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={submitForm}
      >
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
              onChange={onChangeQuery}
            />
          </div>

          {isError && (
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
                { 'is-loading': isLoading },
              )}
              disabled={query.length === 0}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleButtonClick}
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
