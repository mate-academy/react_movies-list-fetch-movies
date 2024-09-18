import React from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  query: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedMovie: Movie | null;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, query: string) => void;
  isLoading: boolean;
  handleAddMovie: (movie: Movie) => void;
  isError: boolean;
  isFindButtonTouched: boolean;
}

export const FindMovie: React.FC<Props> = ({
  query,
  handleInputChange,
  selectedMovie,
  handleSubmit,
  isLoading,
  handleAddMovie,
  isError,
  isFindButtonTouched,
}) => {
  return (
    <>
      <form className="find-movie" onSubmit={e => handleSubmit(e, query)}>
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
              className="input"
              value={query}
              onChange={handleInputChange}
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
              disabled={!query}
              className={`button is-light ${isLoading && 'is-loading'}`}
            >
              {isFindButtonTouched ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {selectedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie(selectedMovie)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {selectedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={selectedMovie} />
        </div>
      )}
    </>
  );
};
