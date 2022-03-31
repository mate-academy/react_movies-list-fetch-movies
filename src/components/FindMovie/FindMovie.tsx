/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { getMovie } from '../../api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  setMovies: (movies: Movie[]) => void,
  movies: Movie[],
};

export const FindMovie: React.FC<Props> = ({ setMovies: onSetMovies, movies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [showError, setShowError] = useState(false);
  const [existMovieError, setExistMovieError] = useState(false);

  const findMovie = async () => {
    if (query === '') {
      return;
    }

    const response = await getMovie(query);

    if (response.Response !== 'False') {
      setMovie(response);
      setShowError(false);
    } else {
      setMovie(null);
      setShowError(true);
    }
  };

  useEffect(() => {
    if (!movie && showError) {
      setShowError(false);
    }

    setMovie(null);
    setExistMovieError(false);
  }, [query]);

  const addMovie = () => {
    if (movie === null) {
      return;
    }

    const alredyExistMovie = movies.find(film => film.imdbID === movie.imdbID);

    if (alredyExistMovie) {
      setExistMovieError(true);
    } else {
      onSetMovies([...movies, movie]);
      setQuery('');
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
              className={classnames(
                'input',
                { 'is-danger': showError },
              )}
              value={query}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setQuery(event.target.value);
              }}
            />
          </div>
          {showError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
          {existMovieError && (
            <p className="help is-danger">
              There is already such a movie in the list
            </p>
          )}
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
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
