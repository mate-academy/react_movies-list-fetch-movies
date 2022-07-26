import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/movie';

type Props = {
  addMovieHandler: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovieHandler }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [hasError, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const findMovieHandler = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    const result = await getMovie(title);

    if (Object.hasOwn(result, 'Error')) {
      setError(true);
    } else {
      setMovie(result);
      setLoading(false);
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
              placeholder="Enter a title to search"
              className="input is-danger"
              onChange={(e) => {
                setTitle(e.target.value);
                setError(false);
              }}
            />
          </div>
          {hasError && (
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
              onClick={findMovieHandler}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              disabled={hasError || movie === null}
              type="button"
              className="button is-primary"
              onClick={() => {
                if (movie) {
                  addMovieHandler(movie);
                  setTitle('');
                  setMovie(null);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} loading={loading} />
        </div>
      )}
    </>
  );
};
