import { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { useMovie } from '../../hooks/useMovie';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [searchValue, setSearchValue] = useState('');
  const {
    movie,
    isLoading,
    isError,
    setQuery,
    clearError,
  } = useMovie();

  const isMovie = movie.title !== '';

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery(searchValue);
    setSearchValue('');
  };

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    clearError();
  };

  const onAddMovie = () => {
    onAdd(movie);
  };

  return (
    <>
      <form className="find-movie" onSubmit={(event) => onSubmit(event)}>
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
              value={searchValue}
              onChange={(event) => onSearchChange(event)}
              autoComplete="off"
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
              className="button is-light"
              disabled={searchValue === ''}
            >
              Find a movie
            </button>
          </div>

          {isMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className={cn('button is-primary', {
                  'is-loading': isLoading,
                })}
                onClick={onAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {isMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
