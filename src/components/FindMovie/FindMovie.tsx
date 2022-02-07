import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

interface Props {
  addToList: AddToList;
}

export const FindMovie: React.FC<Props> = ({ addToList }) => {
  const [title, setTitle] = useState('');
  const [foundedMovie, setFoundedMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');

  const addMovie = () => {
    addToList(foundedMovie);
    setTitle('');
    setError('');
  };

  const findMovie = async () => {
    const foundMovie = await getMovie(title);

    // eslint-disable-next-line no-console
    console.log(foundMovie);

    if (foundMovie.Response === 'False') {
      setFoundedMovie(null);
      setError(`Cannot find movie with title "${title}"`);

      return;
    }

    setFoundedMovie(foundMovie);
    setError('');
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label
            className="label"
            htmlFor="movie-title"
          >
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input', { 'is-danger': error })}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
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
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {foundedMovie && <MovieCard movie={foundedMovie} />}
      </div>
    </>
  );
};
