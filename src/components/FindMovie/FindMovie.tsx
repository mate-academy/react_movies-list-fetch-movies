/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api/Movie';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types';
import './FindMovie.scss';

type Props = {
  addMovie(movie:Movie): void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const fetchMovie = async () => {
    try {
      const foundMovie: Movie = await getMovie(title);

      setMovie(foundMovie);
    } catch (error) {
      console.error(
        'An error has occurred when requesting movie from the server',
      );
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (movie?.Response === 'True') {
      addMovie(movie);
      setTitle('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
              onChange={(event) => setTitle(event.target.value)}
              className={classNames('input', {
                'is-danger': movie?.Response === 'False',
              })}
            />
          </div>

          {movie?.Response === 'False' && (
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
              onClick={fetchMovie}
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
        {movie?.Response === 'True'
          ? <MovieCard movie={movie} />
          : 'Please select other title'}

      </div>
    </>
  );
};
