import React, { useState } from 'react';
import './FindMovie.scss';

import cn from 'classnames';
import { getData } from '../../api';
import { MovieCard } from '../MovieCard';
import { Loader } from '../Loader';
import { ErrorMessage } from '../ErrorMessage';

type Props = {
  listMovies: Movie[],
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie, listMovies }) => {
  const [inputValue, setInputValue] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsloading] = useState(false);
  const [isInputEntered, setIsInputEntered] = useState(true);
  const [isMovieLoaded, setIsMovieLoaded] = useState(true);
  const [isMovieOnList, setIsMovieOnList] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  function changeInput(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
    setIsInputEntered(true);
    setIsMovieLoaded(true);
    setUploadError(false);
  }

  function checkMovieOnList() {
    if (movie) {
      return listMovies
        .some(listMovie => listMovie.imdbID === movie.imdbID);
    }

    return false;
  }

  async function getMovieFromServer() {
    setMovie(null);
    setIsMovieOnList(false);
    setIsMovieLoaded(true);
    setUploadError(false);

    if (!inputValue.length) {
      setIsInputEntered(false);

      return;
    }

    setIsloading(true);

    try {
      const movieFromServer = await getData(inputValue.trim().toLowerCase());

      if (movieFromServer.Title) {
        setMovie(movieFromServer);
        setIsMovieLoaded(true);
      } else {
        setTimeout(() => {
          setIsMovieLoaded(false);
        }, 510);
      }
    } finally {
      setTimeout(() => {
        setIsloading(false);
      }, 500);
    }
  }

  function throwMovie() {
    setIsInputEntered(true);
    setIsMovieLoaded(true);

    if (movie) {
      if (!checkMovieOnList()) {
        setInputValue('');
        addMovie(movie);
      } else {
        setIsMovieOnList(true);
      }
    } else {
      setUploadError(true);
    }

    setMovie(null);
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
                  { 'is-danger': !isMovieLoaded || !isInputEntered || uploadError },
                )}
                value={inputValue}
                onChange={changeInput}
              />
            </div>
          </label>
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
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="errors-container">
        {isInputEntered
          ? (
            <div>
              {isMovieOnList && !uploadError && (
                <div>
                  <ErrorMessage errorMessage="The movie is already on the list" />
                </div>
              )}
            </div>
          )
          : (
            <div>
              <ErrorMessage errorMessage="Please input a title!" />
            </div>
          )}
        {!isMovieLoaded && (
          <div>
            <ErrorMessage errorMessage="Oops... Can't find a movie with such a title" />
          </div>
        )}
        {uploadError && (
          <div>
            <ErrorMessage errorMessage="The movie is not loaded" />
          </div>
        )}
      </div>

      {isLoading
        ? (
          <div className="loader__container">
            <Loader />
          </div>
        )
        : (
          <>
            {movie !== null && (
              <div className="container">
                <h2 className="title">Preview</h2>
                <MovieCard movie={movie} />
              </div>
            )}
          </>
        )}
    </>
  );
};
