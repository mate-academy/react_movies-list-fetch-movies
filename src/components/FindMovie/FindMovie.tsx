import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';

import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (movie: Movie) => void,
  movies: Movie[],
}

enum Error {
  withoutError = '',
  enterTitle = 'Enter a movie name',
  cantFind = 'Can not find a movie with such a title',
  wasAdded = 'Already in your list',
}

export const FindMovie: React.FC<Props> = ({
  addMovie,
  movies,
}) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(Error.withoutError);

  const getfoundMovie = async () => {
    const movie = await getMovie(movieTitle);

    if (!movie.Title) {
      setError(Error.cantFind);

      return;
    }

    setError(Error.withoutError);
    setFoundMovie(movie);
  };

  const handleTitle = (event:React.ChangeEvent<HTMLInputElement>) => {
    setMovieTitle(event.target.value);
    setError(Error.withoutError);
  };

  const handleSubmit = (event:React.FormEvent) => {
    event.preventDefault();

    if (foundMovie && !error) {
      if (!movies.some(movie => movie.imdbID === foundMovie.imdbID)) {
        addMovie(foundMovie);
      } else {
        setError(Error.wasAdded);

        return;
      }
    } else {
      setError(Error.enterTitle);
    }

    setMovieTitle('');
    setFoundMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => handleSubmit(event)}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames(
                'input',
                { 'is-danger': error },
              )}
              value={movieTitle}
              onChange={event => handleTitle(event)}
            />
          </div>

          {error.length > 0 && (
            <p className="help is-danger">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => {
                getfoundMovie();
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {foundMovie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
