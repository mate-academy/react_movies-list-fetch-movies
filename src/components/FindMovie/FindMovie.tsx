/* eslint-disable jsx-a11y/label-has-associated-control */
import { CircularProgress } from '@mui/material';
import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../API/API';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  setMovies: (prev: Movie[], newValue: Movie) => void
  moviesList: Movie[];
};

export const FindMovie: React.FC<Props> = ({ setMovies, moviesList }) => {
  const [movieFromServer, setMovieFromServer] = useState<Movie>();
  const [movieTitle, setMovieTitle] = useState('');
  const [errorFromServer, setErrorFromServer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchMovie = (event: React.FormEvent): void => {
    event.preventDefault();
    setIsLoading(true);
    setErrorFromServer(false);
    getMovie(movieTitle)
      .then(response => {
        setIsLoading(false);
        if (response.Response === 'False') {
          setErrorFromServer(true);
        }

        return setMovieFromServer(response);
      })
      .catch(() => setErrorFromServer(true));
    setMovieTitle('');
  };

  const setMoviesList = (event: React.FormEvent) => {
    event.preventDefault();
    if (!moviesList.some(movie => movie.imdbID === movieFromServer?.imdbID)
      && movieFromServer?.Response !== 'False') {
      if (movieFromServer) {
        setMovies(moviesList, movieFromServer);
      }
    }
  };

  function cons() {
    // eslint-disable-next-line no-console
    return console.log(movieTitle, movieFromServer);
  }

  cons();

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
              className={classNames('input', { 'is-danger': errorFromServer && !movieTitle })}
              value={movieTitle}
              onChange={event => (setMovieTitle(event.target.value))}
            />
          </div>
          {errorFromServer && !movieTitle && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            {isLoading ? (
              <CircularProgress color="primary" />
            ) : (
              <button
                type="button"
                className="button is-light"
                onClick={searchMovie}
              >
                Find a movie
              </button>
            )}
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={setMoviesList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movieFromServer && !errorFromServer && !isLoading && <MovieCard movie={movieFromServer} />}
      </div>
    </>
  );
};
