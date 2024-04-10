import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';

type Props = {
  setMovies: (e: Movie[]) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [query, setQuery] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setError('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (query) {
      setIsLoading(true);

      getMovie(query)
        .then(movie => {
          if ('Error' in movie) {
            setError(`Can't find a movie with such a title`);

            return;
          }

          setFoundMovie(() => {
            const normalizedMovie = {
              title: movie.Title,
              description: movie.Plot,
              imgUrl: movie.Poster,
              imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
              imdbId: movie.imdbID,
            };

            return normalizedMovie;
          });
        })
        .finally(() => setIsLoading(false));
    }
  };

  const resetForm = () => {
    setQuery('');
    setFoundMovie(null);
  };

  const handleAddMovie = () => {
    if (foundMovie) {
      if (movies.find(movie => movie.imdbId === foundMovie.imdbId)) {
        resetForm();

        return;
      }

      setMovies([...movies, foundMovie]);

      resetForm();
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={e => handleSubmit(e)}>
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
              className={classNames('input', {
                'is-danger': error,
              })}
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames(`button is-light`, {
                'is-loading': isLoading,
              })}
              disabled={query.length === 0}
            >
              {foundMovie || error ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
