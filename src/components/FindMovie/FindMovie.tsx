import React, { useState } from 'react';
import cn from 'classnames';
import { getMovieByTitle } from '../../api/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (movie: Movie | null) => void
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [value, setValue] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isTitleChanged, setIsTitleChanged] = useState(true);
  const [isMovieFound, setIsMovieFound] = useState(true);

  const getMovie = async () => {
    try {
      const foundedMovie = await getMovieByTitle(value);

      setMovie(foundedMovie);
      setIsMovieFound(true);
    } catch {
      setIsMovieFound(false);
      setIsTitleChanged(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setIsTitleChanged(true);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                value={value}
                onChange={handleChange}
                placeholder="Enter a title to search"
                className={cn('input', { 'is-danger': !isTitleChanged })}
              />
            </div>
          </label>

          {!isTitleChanged
            && (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
              onClick={getMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => addMovie(movie)}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">{`${isMovieFound ? 'Preview' : 'Movie not found :('}`}</h2>
        {(isMovieFound && movie) && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
