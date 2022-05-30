import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';

import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (movie: Movie) => void,
  movies: Movie[],
}

export const FindMovie: React.FC<Props> = ({
  addMovie,
  movies,
}) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);

  const getfoundMovie = async () => {
    const movie = await getMovie(movieTitle);

    if (!movie.Title) {
      setError(true);

      return;
    }

    setError(false);
    setFoundMovie(movie);
  };

  const handleTitle = (event:React.ChangeEvent<HTMLInputElement>) => {
    setMovieTitle(event.target.value);
    setError(false);
  };

  const handleSubmit = (event:React.FormEvent) => {
    event.preventDefault();

    if (foundMovie && !error) {
      if (!movies.some(movie => movie.imdbID === foundMovie.imdbID)) {
        addMovie(foundMovie);
      }
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

          {error && (
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
