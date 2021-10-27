/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [newMovie, setNewMovie] = useState<Movie | null>();
  const [title, setTitle] = useState('');
  const [movieExists, setMovieExists] = useState(true);

  const requestMovie: React.MouseEventHandler<HTMLButtonElement> = () => {
    return fetch(`https://www.omdbapi.com/?apikey=4b454897&t=${title}`)
      .then(response => response.json())
      // eslint-disable-next-line no-console
      .catch(() => console.log('Error'))
      .then((movie) => {
        if (movie.Response === 'False') {
          setMovieExists(false);
        } else {
          setNewMovie(movie);
        }
      });
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setTitle(event.target.value);
    setMovieExists(true);
  };

  const addAndClear: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (newMovie) {
      addMovie(newMovie);
      setMovieExists(true);
      setTitle('');
      setNewMovie(null);
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': !movieExists })}
              value={title}
              onChange={handleChange}
            />
          </div>

          {!movieExists
          && (
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
              onClick={requestMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addAndClear}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {newMovie && <MovieCard movie={newMovie} />}
      </div>
    </>
  );
};
