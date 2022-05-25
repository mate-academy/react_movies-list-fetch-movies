import React, { ChangeEvent, useCallback, useState } from 'react';
import './FindMovie.scss';

import className from 'classnames';

import { MovieCard } from '../MovieCard';

import { getMovies } from '../../api/api';

type Props = {
  addMovie: (x:Movie) => void
  isMoviesIncludes: (x:Movie) => boolean
};

export const FindMovie: React.FC<Props> = ({ addMovie, isMoviesIncludes }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('Title is empty');

  const handleTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError('');
  };

  const findMovie = useCallback(async () => {
    if (title.trim().length === 0) {
      setTitle('');
      setError('Title is empty');
    } else {
      const movieFromServer = await getMovies(title);

      if (movieFromServer.Response !== 'False') {
        setMovie(movieFromServer);
      } else {
        setError(movieFromServer.Error);
        setMovie(null);
      }
    }
  }, [movie, title]);

  const onAddMovie = () => {
    if (movie && !isMoviesIncludes(movie)) {
      addMovie(movie);
      setTitle('');
      setMovie(null);
    } else {
      if (!movie) {
        setError('Pls choose the movie');
      }

      if (movie && isMoviesIncludes(movie)) {
        setError('Movie already in the list');
      }
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
              className={className('input', {
                'is-danger': error.length !== 0,
              })}
              value={title}
              onChange={handleTitle}
            />
          </div>
          {error.length !== 0 && (
            <p className={className('help', {
              'is-danger': error.length !== 0,
            })}
            >
              {error}
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
              onClick={onAddMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      { movie
    && (
      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard movie={movie} />
      </div>
    )}
    </>
  );
};
