import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { request } from '../../api/api';

type Props = {
  addMovie: (movieToAdd: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const loadMovie = async () => {
    const loadedMovie = await request(title);

    if (loadedMovie.Response !== 'False') {
      setMovie(loadedMovie);
      setIsDisabled(false);
    } else {
      setMovie(null);
      setError(true);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setTitle(event.target.value);
  };

  const haldleClick = () => {
    if (movie) {
      addMovie(movie);
      setTitle('');
      setIsDisabled(true);
      setMovie(null);
    }
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
              value={title}
              onChange={handleChange}
              placeholder="Enter a title to search"
              className="input"
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
              onClick={loadMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              data-cy="add"
              onClick={haldleClick}
              disabled={isDisabled}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
