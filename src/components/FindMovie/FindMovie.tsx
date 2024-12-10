import React from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type FindMovieProps = {
  onSearch: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  query: string;
  onQuery: (e: React.ChangeEvent<HTMLInputElement>) => void;
  movie: Movie | null;
  search: string;
  isLoading: boolean;
  onAddMovie: () => void;
};

export const FindMovie: React.FC<FindMovieProps> = ({
  onSearch,
  query,
  onQuery,
  movie,
  search,
  isLoading,
  onAddMovie,
}: FindMovieProps) => {
  return (
    <>
      <form className="find-movie">
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
              className={`input ${movie?.title === undefined && search === query && query !== '' && 'is-danger'}`}
              value={query}
              onChange={onQuery}
            />
          </div>

          {movie?.title === undefined && search === query && query !== '' && (
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
              className={`button is-light ${isLoading && 'is-loading'}`}
              disabled={query === ''}
              onClick={onSearch}
            >
              Find a movie
            </button>
          </div>

          {movie?.title !== undefined && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {movie?.title !== undefined && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
