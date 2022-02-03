/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

export const FindMovie: React.FC = () => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleSearch = async () => {
    // eslint-disable-next-line no-console
    // console.log(getMovie('batman'));
    const foundMovie = await getMovie();

    // eslint-disable-next-line no-console
    console.log(foundMovie);

    setMovie(null);
    // setTitle('');
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            {movie?.Title}
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              value={title}
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': title })}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          {title && (
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
              onClick={() => handleSearch()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
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
