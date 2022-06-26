import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

type Props = {
  movieList: (newMovie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ movieList }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (movie?.Response === 'False') {
      setError(true);
    }
  }, [movie]);

  const checkConditions = showPreview && movie && movie.Response === 'True';

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError(false);
              }}
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': error,
              })}
            />
          </div>

          {error && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              data-cy="find"
              onClick={() => {
                getMovie(title)
                  .then(movieFromServer => setMovie(movieFromServer));

                setShowPreview(true);
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              data-cy="add"
              disabled={movie?.Response === 'False'}
              onClick={() => {
                if (movie) {
                  movieList(movie);
                }

                setShowPreview(false);
                setTitle('');
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">{error && movie?.Error}</h2>
        {
          checkConditions && <MovieCard movie={movie} />
        }
      </div>
    </>
  );
};
