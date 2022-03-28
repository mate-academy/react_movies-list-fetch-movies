import React, { useState } from 'react';
import './FindMovie.scss';

import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  setMovies: (callback: (movies: Movie[]) => Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isInvalid, setIsInvalid] = useState(false);

  const getMovieFromServer = async () => {
    const movieFromServer = await getMovie(title);

    if (!movieFromServer) {
      setIsInvalid(true);
      setMovie(null);
    }

    return setMovie(movieFromServer);
  };

  const addMovie = () => {
    if (movie) {
      setMovies((movies) => {
        if (movies.find((m) => m.imdbID === movie.imdbID)) {
          return movies;
        }

        return [...movies, movie];
      });
      setTitle('');
      setMovie(null);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          getMovieFromServer();
        }}
      >
        <div className="field">
          <label
            className="label"
            htmlFor="movie-title"
          >
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                value={title}
                placeholder="Enter a title to search"
                className={classNames('input', { 'is-danger': isInvalid })}
                onChange={(event) => (
                  isInvalid
                    ? setIsInvalid(false)
                    : setTitle(event.target.value))}
              />
            </div>
          </label>

          {isInvalid && (
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
        {movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        )}
      </div>
    </>
  );
};
