import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addNewMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addNewMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState({} as Movie);
  const [error, setError] = useState('');

  const loadMovie = async () => {
    const newMovie = await getMovie(title);

    if (newMovie.Response === 'True') {
      setMovie(newMovie);
      setError('');
    } else {
      setMovie({} as Movie);
      setError(newMovie.Error);
    }
  };

  const handleAddMovie = () => {
    addNewMovie(movie);
    setTitle('');
    setMovie({} as Movie);
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
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                }}
                placeholder="Enter a title to search"
                className={classNames(
                  'input',
                  { 'is-danger': error },
                )}
              />
            </div>
          </label>
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
              onClick={() => handleAddMovie()}
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
