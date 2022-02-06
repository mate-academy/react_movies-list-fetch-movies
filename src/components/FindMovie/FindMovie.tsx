import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { findMovie } from '../../api';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setError] = useState<boolean>(false);

  const getMovie = async () => {
    const foundMovie = await findMovie(title);

    if (foundMovie.Response === 'False') {
      setMovie(null);
      setError(true);
    } else {
      setMovie(foundMovie);
      setError(false);
    }
  };

  const submitForm: React.FormEventHandler = (event) => {
    event.preventDefault();
    if (movie) {
      addMovie(movie);
      setTitle('');
      setMovie(null);
      setError(false);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={submitForm}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                value={title}
                onChange={event => setTitle(event.target.value)}
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className="input"
              />
            </div>
          </label>

          {isError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              onClick={getMovie}
              type="button"
              className="button is-light"
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
        { movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
