import React from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { transformMovieData } from '../../helpers/transformMovie';
import { Movie } from '../../types/Movie';

type Props = {
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onAdd: (movie: Movie) => void;
  query: string;
  isError: boolean;
  isLoading: boolean;
  movieData: MovieData | null;
};

export const FindMovie: React.FC<Props> = ({
  onInputChange,
  onSubmit,
  query,
  isError,
  isLoading,
  movieData,
  onAdd,
}) => {
  return (
    <>
      <form className="find-movie" onSubmit={onSubmit}>
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
              className={`input ${isError ? 'is-danger' : ''}`}
              value={query}
              onChange={onInputChange}
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
              disabled={!query || isLoading}
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
            >
              {movieData ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movieData && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => onAdd(transformMovieData(movieData) as Movie)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movieData && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={transformMovieData(movieData)} />
        </div>
      )}
    </>
  );
};
