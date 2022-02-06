import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';

import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  setMovies: (movie: Movie[]) => void,
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleSearchButton = async () => {
    const movieFromServer = await getMovie(title);

    if (!movieFromServer.imdbID) {
      setHasError(true);
    }

    setMovie(movieFromServer);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasError(false);
  };

  const addMovie = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (movie?.imdbID && !movies.find(currentMovie => movie.imdbID === currentMovie.imdbID)) {
      setMovies([...movies, movie]);
    }

    setTitle('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={addMovie}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title

            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input is-link', {
                  'is-danger': hasError,
                })}
                value={title}
                onChange={handleInput}
              />
            </div>
          </label>

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
              className="button is-light"
              onClick={handleSearchButton}
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

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie?.imdbID && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
