import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie | null) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [showMovie, setShowMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [hasError, setHasError] = useState(false);

  const resetForm = () => {
    setTitle('');
  };

  const handlerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasError(false);
  };

  const handlerSumbit
  = (event: React.FormEvent<HTMLFormElement>
  | React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    getMovie(title)
      .then((movie) => {
        if (movie.Response === 'True') {
          setShowMovie(movie);
        } else {
          setHasError(true);
        }
      });

    resetForm();
  };

  const addTheMovie = () => {
    addMovie(showMovie);
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
              value={title}
              onChange={handlerChange}
              placeholder="Enter a title to search"
              className="input"
            />
          </div>
          {hasError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              onClick={handlerSumbit}
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              onClick={addTheMovie}
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {showMovie && <MovieCard movie={showMovie} />}
      </div>
    </>
  );
};
