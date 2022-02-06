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
  const [isMovieLoaded, setIsMovieLoaded] = useState(false);
  const [isMovieOnList, setIsMovieOnList] = useState(false);
  const [isSubmitButtonDisable, setIsSubmitButtonDisable] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);
  const [emptyFormError, setEmptyFormError] = useState(false);

  function changeInput(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
    setIsInputEntered(true);
    setFirstLoad(false);
  }

  function checkMovieOnList(movieForCheck: Movie) {
    if (movieForCheck) {
      return listMovies
        .some(listMovie => (
          listMovie.Title.toLowerCase().includes(
            movieForCheck.Title.trim().toLowerCase(),
          )
        ));
    }

    return false;
  }

  async function getMovieFromServer() {
    setMovie(null);
    setIsMovieLoaded(false);
    setIsMovieOnList(false);
    setIsSubmitButtonDisable(true);
    setEmptyFormError(false);

    if (!inputValue.length) {
      setIsInputEntered(false);
      setFirstLoad(true);

      return;
    }

    setIsloading(true);

    try {
      const movieFromServer = await getData(inputValue.trim().toLowerCase());

      if (movieFromServer.Title) {
        setMovie(movieFromServer);
        setIsMovieLoaded(true);

        if (!checkMovieOnList(movieFromServer)) {
          setTimeout(() => {
            setIsSubmitButtonDisable(false);
          }, 510);
        } else {
          setTimeout(() => {
            setIsMovieOnList(true);
          }, 300);
        }
      } else {
        setIsMovieLoaded(false);
      }
    } finally {
      setTimeout(() => {
        setIsloading(false);
        setFirstLoad(true);
      }, 500);
    }
  }

  function throwMovie() {
    setIsSubmitButtonDisable(true);

    if (firstLoad) {
      setIsMovieOnList(true);
    }

    if (!firstLoad) {
      setEmptyFormError(true);
    }

    if (movie) {
      setInputValue('');

      if (!checkMovieOnList(movie)) {
        addMovie(movie);
      }
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
                  { 'is-danger': firstLoad && !isMovieLoaded },
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
              disabled={isSubmitButtonDisable}
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
          <div>
            {isMovieLoaded
              ? (
                <div>
                  {isMovieOnList
                    ? (
                      <div>
                        <ErrorMessage errorMessage="The movie is already on the list. Please try to find another movie!" />
                      </div>
                    )
                    : (
                      <div className="container">
                        <h2 className="title">Preview</h2>
                        <MovieCard movie={movie} />
                      </div>
                    )}
                </div>
              )
              : (
                <div>
                  {firstLoad && isInputEntered && (
                    <ErrorMessage errorMessage={'Oops... Can\'t find a movie with such a title'} />
                  )}
                  {!isInputEntered && !emptyFormError && (
                    <div>
                      <ErrorMessage errorMessage="Please input a title!" />
                    </div>
                  )}
                  {emptyFormError && (
                    <div>
                      <ErrorMessage errorMessage="Please try to find a movie!" />
                    </div>
                  )}
                </div>
              )}
          </div>
        )}
    </>
  );
};
