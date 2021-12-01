import React, { useState } from 'react';
import { getFilms } from '../../api/server';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  loadFilm: (name: Movie) => void,
  errorTrue: () => void,
  errorFalse: () => void,
  hasLoadingError: boolean,
};

export const FindMovie: React.FC<Props> = ({
  movies,
  loadFilm,
  errorTrue,
  errorFalse,
  hasLoadingError,
}) => {
  const [film, setFilm] = useState('');
  const [searchFilm, setSearchFilm] = useState<Movie | undefined>();
  const [haveFilm, setHaveFilm] = useState('');

  const loadMovie = async (url: string) => {
    const movie: Movie = await getFilms(url);

    if (movies.some(item => item.imdbID === movie.imdbID)) {
      return setHaveFilm('have');
    }

    if (!movie.Error) {
      setSearchFilm({ ...movie });
      setFilm('');
      setHaveFilm('');

      return errorFalse();
    }

    setHaveFilm('');

    return errorTrue();
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
                placeholder="Enter a title to search"
                className="input"
                value={film}
                onChange={(event) => {
                  setFilm(event.target.value);
                }}
              />
            </div>
          </label>
          {hasLoadingError && (
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
                setSearchFilm(undefined);
                loadMovie(film);
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (searchFilm) {
                  loadFilm(searchFilm);
                  setSearchFilm(undefined);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {searchFilm?.Response && (
          <MovieCard movie={searchFilm} />
        )}
        {haveFilm && (
          <div className="error">
            This film has in our list
          </div>
        )}
      </div>
    </>
  );
};
