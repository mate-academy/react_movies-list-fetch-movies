import React, { useState } from 'react';
import './FindMovie.scss';
import { requestFromServer } from '../../api';
import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const reset = () => {
    setValue('');
    setError(false);
    setMovie(null);
  };

  // eslint-disable-next-line no-console
  console.log(movie);

  const findMovie = () => {
    requestFromServer(value).then(film => {
      if (!film.Title) {
        setError(true);
      }

      if (film.Title) {
        setMovie(film);
      }
    });
  };

  const handelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setError(false);
  };

  const handelSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!movie) {
      setError(true);
    }

    if (movie) {
      addMovie(movie);
    }

    reset();
  };

  return (
    <>
      <form
        className="find-movie"
      >
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
              onChange={handelChange}
              value={value}
            />
          </div>
          {error
          && (
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
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              onClick={handelSubmit}
            >
              Add to the list
            </button>
          </div>
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
