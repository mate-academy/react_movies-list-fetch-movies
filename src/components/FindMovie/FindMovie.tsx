import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard/MovieCard';
import classNames from 'classnames';

type Props = {
  movieList: Movie[];
  setMovieList: React.Dispatch<React.SetStateAction<Movie[]>>;
};

function isAtList(list: Movie[], movie: Movie) {
  return list.some(film => film.imdbId === movie.imdbId);
}

export const FindMovie: React.FC<Props> = ({ movieList, setMovieList }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setError] = useState(false);
  const [message, setMessage] = useState('Find a movie');

  useEffect(() => {
    if (movie) {
      if (movie.Response === 'False') {
        setError(true);
      }
    }
  }, [movie]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => {
          event.preventDefault();
          setTimeout(() => {
            setLoading(true);
            setMessage('Search again');
          }, 200);
          setTimeout(() => {
            getMovie(query)
              .then(foundedMovie => {
                setMovie(foundedMovie);
              })
              .finally(() => setLoading(false));
          }, 600);
        }}
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
              className={classNames('input', { 'is-danger': hasError })}
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setError(false);
              }}
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
              className={classNames('button is-light')}
              disabled={query === ''}
            >
              {loading ? (
                <div className="loader-wrapper">
                  <div className="loader is-loading"></div>
                </div>
              ) : (
                `${message}`
              )}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  if (movie && !isAtList(movieList, movie)) {
                    setMovieList(prevList => [...prevList, movie]);
                    setQuery('');
                    setMovie(null);
                  }
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>

        {movie && movie.Response === 'True' && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
