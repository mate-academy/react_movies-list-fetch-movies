import React, { useState } from 'react';
import { getMovie } from '../../api/moviesApi';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | undefined>();
  const [error, setError] = useState(true);

  const handleFindMovie = () => {
    if (title.trim().length) {
      getMovie(title)
        .then(result => {
          if (result.Response === 'False') {
            setError(false);
          } else {
            setMovie(result);
          }
        });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError(true);
  };

  const handleClearFields = () => {
    if (movie) {
      addMovie(movie);
      setTitle('');
      setMovie(undefined);
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <p className="label">
            Movie title
          </p>

          <div className="control">
            <input
              type="text"
              value={title}
              placeholder="Enter a title to search"
              className="input is-danger"
              onChange={handleChange}
            />
            {!error && (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )}
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={handleFindMovie}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                type="button"
                className="button is-primary"
                onClick={handleClearFields}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (
          <MovieCard movie={movie} />
        )}
      </div>
    </>
  );
};
