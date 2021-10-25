import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieError, setError] = useState<boolean>(false);

  const findMovie = () => {
    getMovie(title)
      .then(newMovie => {
        if (newMovie.Response === 'False') {
          setError(true);
          setMovie(null);
          setTitle('');
        } else {
          setMovie(newMovie);
          setError(false);
        }
      });
  };

  const handleSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();

    addMovie(movie as Movie);
    setMovie(null);
    setTitle('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input',
                  { 'is-danger': movieError })}
                value={title}
                onChange={(event) => {
                  setTitle(event.currentTarget.value);
                }}
              />
            </div>
          </label>
          {movieError && (
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
              disabled={!movie}
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
