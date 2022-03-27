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
  const [invalid, setInvalid] = useState(false);

  const getMoviesFromServer = async () => {
    const moviesFromServer = await getMovie(title);

    if (!moviesFromServer) {
      setInvalid(true);
      setMovie(null);
    }

    return setMovie(moviesFromServer);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          getMoviesFromServer();
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
                className={classNames('input', { 'is-danger': invalid })}
                onChange={(event) => (invalid ? setInvalid(false) : setTitle(event.target.value))}
              />
            </div>
          </label>

          {invalid && (
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
              onClick={(event) => {
                event.preventDefault();
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
              }}
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
