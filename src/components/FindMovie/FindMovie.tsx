import React, { useState } from 'react';
import './FindMovie.scss';
import classnames from 'classnames';
import { findMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState({} as Movie);
  const [error, setError] = useState('');

  const loadMovie = async () => {
    const newMovie = await findMovie(title);

    if (newMovie.Response === 'True') {
      setError('');
      setMovie(newMovie);
    } else {
      setError(newMovie.Error);
      setMovie({} as Movie);
    }
  };

  const handleAddMovie = () => {
    addMovie(movie);
    setMovie({} as Movie);
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <div className="control">
            <label className="label" htmlFor="movie-title">
              Movie title
              <input
                type="text"
                id="movie-title"
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                }}
                placeholder="Enter a title to search"
                className={
                  classnames(
                    'input',
                    { 'is-danger': !!error },
                  )
                }
              />
            </label>

          </div>

          <p className="help is-danger">
            {error}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => loadMovie()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                handleAddMovie();
              }}
              disabled={!movie.Title}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie.Title && (
          <MovieCard movie={movie} />
        )}
      </div>
    </>
  );
};
