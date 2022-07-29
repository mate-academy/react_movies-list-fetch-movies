import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>
};

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    getMovie(query)
      .then(loadedMovie => {
        if (loadedMovie === undefined || 'Error' in loadedMovie) {
          setError(true);
          setSpinner(false);

          return;
        }

        let url = loadedMovie.Poster;

        if (loadedMovie.Poster === '') {
          url = 'https://via.placeholder.com/360x270.png?text=no%20preview';
        }

        const preparedMovie = {
          title: loadedMovie.Title,
          description: loadedMovie.Plot,
          imgUrl: url,
          imdbUrl: `https://www.imdb.com/title/${loadedMovie.imdbID}/`,
          imdbId: loadedMovie.imdbID,
        };

        setMovie(preparedMovie);
      })
      .finally(() => setSpinner(false));
    setError(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onSubmit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              onChange={event => {
                setError(false);
                setQuery(event.target.value);
              }}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
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
            {movie ? (
              <button
                data-cy="searchButton"
                type="submit"
                className={classNames(
                  'button',
                  'is-ligth',
                  {
                    'is-loading': spinner,
                  },
                )}
                disabled={query.length === 0}
                onClick={() => setSpinner(true)}
              >
                Search again
              </button>
            ) : (
              <button
                data-cy="searchButton"
                type="submit"
                className={classNames(
                  'button',
                  'is-ligth',
                  {
                    'is-loading': spinner,
                  },
                )}
                disabled={query.length === 0}
                onClick={() => setSpinner(true)}
              >
                Find a movie
              </button>
            )}

          </div>
          {movie !== null && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  setMovies(current => {
                    if (current
                      .find(curMovie => curMovie.imdbId === movie.imdbId)) {
                      setMovie(null);

                      return [...current];
                    }

                    return [...current, movie];
                  });
                  setQuery('');
                  setMovie(null);
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
          {movie && <MovieCard movie={movie} />}
        </div>
      )}
    </>
  );
};
