import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../api/movie';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [titleValue, setTitleValue] = useState('');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(false);

  const handleInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(event.target.value);
    setError(false);
  };

  const searchMovie = async () => {
    const newMovie = await getMovie(titleValue);

    if (newMovie.Response === 'False') {
      setMovie(null);
      setError(true);
    } else {
      setMovie(newMovie);
      setError(false);
    }
  };

  const submitForm: React.FormEventHandler = (event) => {
    event.preventDefault();

    if (movie) {
      addMovie(movie);
      setTitleValue('');
      setMovie(null);
      setTitleValue('');
      setError(false);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={submitForm}>
        <div className="field">
          <div className="control">
            <label
              className="label"
              htmlFor="movie-title"
            >
              Movie title

              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={cn('input',
                  { 'input is-danger': error })}
                value={titleValue}
                onChange={event => handleInputValue(event)}
              />
            </label>
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
              onClick={searchMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
