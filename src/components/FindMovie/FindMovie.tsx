import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api/api';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Callback = (movies: Movie[]) => Movie[];

type Props = {
  setMovies: (callback: Callback) => void;
};

export const FindMovie: React.FC<Props> = React.memo(({ setMovies }) => {
  const [title, setTitle] = useState('');
  const [isInvalid, setInvalid] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isInvalid) {
        setInvalid(false);
      }

      setTitle(event.target.value);
    },
    [isInvalid],
  );

  const addMovie = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (movie) {
      setMovies((movies) => {
        if (movies.find(m => m.imdbID === movie.imdbID)) {
          return movies;
        }

        return [...movies, movie];
      });

      setMovie(null);
      setTitle('');
    }
  }, [movie]);

  const fetchMovie = useCallback(async () => {
    const movieFromServer = await getMovie(title);

    if (!movieFromServer) {
      setMovie(null);
      setInvalid(true);
    } else {
      setMovie(movieFromServer);
    }
  }, [title]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          fetchMovie();
        }}
      >
        <div className="field">
          <div className="control">
            <label className="label" htmlFor="movie-title">
              Movie title
              <input
                type="text"
                id="movie-title"
                value={title}
                placeholder="Enter title"
                className={classNames('input', { 'is-danger': isInvalid })}
                onChange={onInputChange}
              />
            </label>
          </div>

          {isInvalid && (
            <p className="help is-danger">
              Couldn&apos;t find movie with this title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
            >
              Search
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovie}
            >
              Add to list
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
});
