import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { MovieContext } from '../Context.tsx';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

export const FindMovie: React.FC = () => {
  const { query, setQuery, onAddMovies } = useContext(MovieContext);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieData | null>(null);

  const addMoviesToList = () => {
    if (selectedMovie) {
      onAddMovies(selectedMovie);
      setSelectedMovie(null);
      setQuery('');
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    return setHasError(false);
  }, [query]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    getMovie(query)
      .then((movieFromServer) => {
        if ('Error' in movieFromServer) {
          throw new Error();
        }

        setSelectedMovie({
          Poster: movieFromServer.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : movieFromServer.Poster,
          Title: movieFromServer.Title,
          Plot: movieFromServer.Plot,
          imdbID: movieFromServer.imdbID,
        });
      })
      .catch(() => setHasError(true))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              className={cn('input', {
                'is-danger': hasError,
              })}
              value={query}
              onChange={handleQueryChange}
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
              className={cn('button is-light', {
                'is-loading': loading,
              })}
              disabled={!query.trim()}
            >
              {selectedMovie ? (
                'Search again'
              ) : (
                'Find a movie'
              )}
            </button>
          </div>

          {selectedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMoviesToList}
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
