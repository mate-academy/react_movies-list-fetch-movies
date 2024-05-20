import React, { useCallback, useEffect, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';

type Props = {
  onAddMovie: (value: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [input, setInput] = useState('');
  const [movie, setMovie] = useState<Movie | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (input.trim().length === 0) {
      setError(false);
      setMovie(undefined);
    }
  }, [input]);

  const handleFetchMovie = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setLoading(true);
      if (input) {
        getMovie(input)
          .then(response => {
            if ('Title' in response) {
              const newMovie: Movie = {
                title: response.Title,
                description: response.Plot,
                imgUrl: response.Poster,
                imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
                imdbId: response.imdbID,
              };

              setMovie(newMovie);
            }

            if ('Error' in response) {
              setError(true);
              setMovie(undefined);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    [input],
  );

  const handleClickAdd = () => {
    if (movie) {
      onAddMovie(movie);
    }

    setMovie(undefined);
    // setError(false);
  };

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
              value={input}
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': error && !movie,
              })}
              onChange={e => {
                setInput(e.target.value);
                setError(false);
              }}
            />
          </div>

          {error && !movie && (
            <p
              className={classNames('help', { 'is-danger': error })}
              data-cy="errorMessage"
            >
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              onClick={e => handleFetchMovie(e)}
              disabled={!input}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && input && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleClickAdd}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>
      {movie !== undefined && (
        <div className="container" data-cy="previewContainer">
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        </div>
      )}
    </>
  );
};
