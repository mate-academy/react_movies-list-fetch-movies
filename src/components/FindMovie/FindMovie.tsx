/* eslint-disable no-console */
import React, { useState } from 'react';
import './FindMovie.scss';
import classnames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getData } from '../../api/movies';

type Props = {
  addMovie: (movie: Movie) => void | boolean,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorMessage, setError] = useState('');

  const getMovie = async () => {
    try {
      const response = await getData(title);

      if (response.Response === 'False') {
        throw new Error('err');
      }

      setMovie(response);
    } catch (error) {
      setMovie(null);
      setError('Can\'t find a movie with such a title');
    }
  };

  const chooseMovie = (event:React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError('');
  };

  const addToList = () => {
    if (movie) {
      if (addMovie(movie) === false) {
        setError('This movie already exist in your list');
      }

      setTitle('');
      setMovie(null);
    }
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
                  { 'is-danger': errorMessage },
                )}
                value={title}
                onChange={chooseMovie}
              />
            </div>
          </label>
        </div>

        {errorMessage}

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={getMovie}
              disabled={errorMessage.length > 0 || !title}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addToList}
              disabled={errorMessage.length > 0 || !title || !movie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
