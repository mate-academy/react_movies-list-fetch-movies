import React, { useState } from 'react';
import './FindMovie.scss';

import cn from 'classnames';
import { getData } from '../../api';
import { MovieCard } from '../MovieCard';
import { Loader } from '../Loader';

type Props = {
  listMovies: Movie[],
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie, listMovies }) => {
  const [inputValue, setInputValue] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isErrorVisible, changeErrorVisibility] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [movieInListError, setMovieInListError] = useState(false);

  function isMovieNotInList(movieForCompare: Movie) {
    return !listMovies
      .some(listMovie => listMovie.imdbID === movieForCompare.imdbID);
  }

  function changeInput(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
    changeErrorVisibility(false);
  }

  async function getMovieFromServer() {
    setIsloading(true);

    try {
      const movieFromServer = await getData(inputValue.trim().toLowerCase());

      if (movieFromServer.Title) {
        setMovie(movieFromServer);

        if (isMovieNotInList(movieFromServer)) {
          setMovieInListError(false);
        }
      } else {
        changeErrorVisibility(true);
      }
    } finally {
      setTimeout(() => {
        setIsloading(false);
      }, 500);
    }
  }

  function throwMovie() {
    if (movie) {
      setInputValue('');

      if (isMovieNotInList(movie)) {
        addMovie(movie);
      } else {
        setMovieInListError(true);
      }
    }
  }

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
                className={cn(
                  'input',
                  { 'is-danger': isErrorVisible },
                )}
                value={inputValue}
                onChange={changeInput}
              />
            </div>
          </label>

          {(isErrorVisible || movieInListError) && (
            <p className="help is-danger">
              {movieInListError
                ? 'The movie is already on the list'
                : 'Can\'t find a movie with such a title'}
            </p>
          )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={getMovieFromServer}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={throwMovie}
              disabled={movieInListError}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {isLoading
        ? (
          <div className="loader__container">
            <Loader />
          </div>
        )
        : (
          <div className="container">
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </div>
        )}
    </>
  );
};
