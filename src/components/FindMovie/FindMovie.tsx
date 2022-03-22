import React, { useState } from 'react';
import classnames from 'classnames';
import { getMovie } from '../../api/api';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie>();
  const [error, setError] = useState(false);

  const onTitleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError(false);
  };

  const findMovie = () => {
    getMovie(title)
      .then(data => setMovie(data))
      .then(() => setError(true));
  };

  const addNewMovie = () => {
    if (movie) {
      addMovie(movie);
    }

    setTitle('');
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classnames(
                  'input',
                  { 'is-danger': !movie && error },
                )}
                value={title}
                onChange={onTitleClick}
              />
            </div>
          </label>

          {!movie && error && (
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
              type="button"
              className="button is-primary"
              onClick={addNewMovie}
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
