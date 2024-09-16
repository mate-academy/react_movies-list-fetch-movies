import React, { useContext, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';
import { moviesContext } from '../../Store';
import { changeMovieDataType, updateMovies } from '../../utils';
import { MovieData } from '../../types/MovieData';

export const FindMovie: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const { movies, setMovies } = useContext(moviesContext);

  function handleAddingMovie() {
    setMovies(updateMovies(movies, movie));
    setQuery('');
    setMovie(null);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (query.length > 0) {
      setLoading(true);
      getMovie(query.toLowerCase())
        .then(movieFromServer => {
          if (movieFromServer.hasOwnProperty('Title')) {
            setMovie(changeMovieDataType(movieFromServer as MovieData));
          } else {
            setErrorMessage('Try again later');
          }
        })
        .finally(() => setLoading(false));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setErrorMessage('');
  };

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
              autoComplete="off"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input ', {
                'is-danger': !query && errorMessage,
              })}
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {query && errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              disabled={!query}
              type="submit"
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
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
                onClick={handleAddingMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {!errorMessage && movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
