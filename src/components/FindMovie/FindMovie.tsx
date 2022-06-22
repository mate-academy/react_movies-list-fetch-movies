import React, { useState } from 'react';
import './FindMovie.scss';
import { requestMovies } from '../../api';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movieFromServer: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [tempTitle, setTempTitle] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);

  const [error, setError] = useState(false);

  const requestButton = () => {
    requestMovies(tempTitle)
      .then(movieFromServer => {
        if (!movieFromServer) {
          setError(true);
        } else {
          setFoundMovie(movieFromServer);
          setError(false);
        }
      })
      .catch(() => {
        setError(true);
      });
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
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              value={tempTitle}
              onChange={(event) => {
                setTempTitle(event.target.value);
                setError(false);
              }}
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
              data-cy="find"
              className="button is-light"
              onClick={requestButton}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              data-cy="add"
              className="button is-primary"
              onClick={() => {
                if (foundMovie) {
                  addMovie(foundMovie);
                }

                setTempTitle('');
                setFoundMovie(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {foundMovie && (
          <MovieCard movie={foundMovie} />
        )}
      </div>
    </>
  );
};
