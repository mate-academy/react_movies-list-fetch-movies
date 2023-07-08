import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie, expeсtedMovie } from '../../api';
import { Movie } from '../../types/Movie';
// import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard/MovieCard';

interface FindMovieProps {
  handleAddMovie: (movie: Movie) => void,
}

export const FindMovie: React.FC<FindMovieProps> = ({ handleAddMovie }) => {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setSearch(value);
    setHasError(false);
  };

  const handleFindMovie = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(search)
      .then(result => {
        if ('imdbID' in result) {
          setMovie(expeсtedMovie(result));
        } else {
          setHasError(true);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleClear = () => {
    setMovie(null);
    setSearch('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFindMovie}>
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
              className={`input ${hasError && 'is-danger'}`}
              value={search}
              onChange={handleSearch}
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
                  'is-loading': isLoading,
                },
              )}
              disabled={!search.length}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  handleClear();

                  return handleAddMovie(movie);
                }}
              >
                Add to the list
              </button>
            </div>
          )}
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
