import React, { useState } from 'react';
import './FindMovie.scss';
import { newMovie, getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  handleAddMovie: (movie: Movie) => void,
}

export const FindMovie: React.FC <Props> = ({ handleAddMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFindMovie = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(query)
      .then(result => {
        if ('imdbID' in result) {
          setMovie(newMovie(result));
        } else {
          setError(true);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    setError(false);
  };

  const handleClear = () => {
    setMovie(null);
    setQuery('');
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
              className="input is-danger"
              value={query}
              onChange={handleQuery}
            />
          </div>

          {error && (
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
              className={
                isLoading
                  ? 'button is-light is-loading'
                  : 'button is-light'
              }
              disabled={!query}
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
                  handleAddMovie(movie);
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
