import React, { useState } from 'react';
import classNames from 'classnames';

import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface Props {
  addToMovieList: (movie: Movie) => void
}

export const FindMovie: React.FC<Props> = ({ addToMovieList }) => {
  const [movie, setMovie] = useState(null);
  const [query, setQuery] = useState('');
  const [isMovieFound, setIsMovieFound] = useState(true);

  const movieFinder = async () => {
    try {
      const searchMovie = await getMovie(query);

      setMovie(searchMovie);
    } catch (error) {
      setMovie(null);
      setIsMovieFound(false);
    }
  };

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsMovieFound(true);
    setQuery(event.target.value);
  };

  const findMovieHandler = () => {
    movieFinder();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setQuery('');

    if (movie) {
      addToMovieList(movie);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
      >
        <div className="field">
          Movie title

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              value={query}
              onChange={inputHandler}
              className={classNames('input', {
                'is-danger': !isMovieFound,
              })}
            />
          </div>

          {!isMovieFound && (
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
              onClick={findMovieHandler}
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
        {movie && <MovieCard movie={movie} />}
        {!isMovieFound && (
          <h2>
            This is place for error, but not today
          </h2>
        )}
      </div>
    </>
  );
};
