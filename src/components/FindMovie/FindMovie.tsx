import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getFilm } from '../../api/api';

type Props = {
  addMovieToList: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovieToList }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [inputSearch, setInputSearch] = useState<string>('');
  const [isError, setError] = useState<boolean>(false);

  const loadMovie = () => {
    getFilm(inputSearch)
      .then(film => {
        if (film.Response === 'True') {
          setMovie(film);
          setError(false);
        } else {
          setMovie(null);
          setError(true);
        }
      });
  };

  const addNewMovie = () => {
    if (movie) {
      addMovieToList(movie);
    }

    setError(false);
    setInputSearch('');
    setMovie(null);
  };

  const handlerInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearch(event.target.value);
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
                className={classNames('input', { 'is-danger': isError })}
                value={inputSearch}
                onChange={handlerInput}
              />
            </div>
          </label>
          { isError && (
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
              onClick={loadMovie}
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
        { movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        )}
      </div>
    </>
  );
};
