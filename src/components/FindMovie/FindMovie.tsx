/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import classNames from 'classnames';

import { getMovieByTitle } from '../../api/api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface Props {
  onAddMovie: (movie: Movie) => void
}

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [wasMovieFound, setWasMovieFound] = useState(true);

  const loadMovie = async () => {
    try {
      const findedMovie = await getMovieByTitle(title);

      setMovie(findedMovie);
    } catch (error) {
      setMovie(null);
      setWasMovieFound(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setWasMovieFound(true);
    setTitle(value);
  };

  const handleFindButton = () => {
    loadMovie();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setTitle('');

    if (movie) {
      onAddMovie(movie);
    }
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
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              value={title}
              onChange={handleInputChange}
              className={classNames('input', {
                'is-danger': !wasMovieFound,
              })}
            />
          </div>

          {!wasMovieFound && (
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
              onClick={handleFindButton}
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
        {movie && <MovieCard movie={movie} /> }
        {!wasMovieFound && (
          <div className="alert alert-warning" role="alert">
            Movie not found
          </div>
        )}
      </div>
    </>
  );
};
