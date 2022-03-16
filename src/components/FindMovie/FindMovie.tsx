import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api/api';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  setMovies: (callback: (movies: Movie[]) => Movie[]) => void;
};

export const FindMovie: React.FC<Props> = React.memo(({ setMovies }) => {
  const [isInvalid, setInvalid] = useState(false);
  const [movie, setMovie] = useState<Movie>();

  const titleRef = useRef(document.createElement('input'));

  const fetchMovie = async () => {
    const res = await getMovie(titleRef.current.value);

    if (!res) {
      setMovie(undefined);
      setInvalid(true);
    } else {
      setMovie(res);
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <div className="control">
            <label className="label" htmlFor="movie-title">
              Movie title
              <input
                type="text"
                id="movie-title"
                ref={titleRef}
                placeholder="Enter title"
                className={classNames('input', { 'is-danger': isInvalid })}
                onChange={() => {
                  if (isInvalid) {
                    setInvalid(false);
                  }
                }}
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
              type="button"
              className="button is-light"
              onClick={() => {
                fetchMovie();
              }}
            >
              Search
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (movie) {
                  setMovies((movies) => {
                    if (movies.find(m => m.imdbID === movie.imdbID)) {
                      return movies;
                    }

                    return [...movies, movie];
                  });
                  setMovie(undefined);
                  titleRef.current.value = '';
                }
              }}
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
