import React, { useState } from 'react';
import './FindMovie.scss';

import Class from 'classnames';
import { MovieCard } from '../MovieCard';
import { getFilms } from '../../api/api';

interface Props {
  addMovie: (movie: Movie) => boolean
}

export const FindMovie: React.FC<Props> = React.memo(
  ({ addMovie }) => {
    const [query, setQuery] = useState('');

    const [isInList, setIsInList] = useState(false);

    const [error, setError] = useState(false);

    const [film, setFilm] = useState<Movie | null>(null);

    const getFilmsByTitle = async (title: string) => {
      const neededFilm = await getFilms(title);

      if (neededFilm.Response === 'False') {
        setError(true);

        return;
      }

      setFilm(neededFilm);
    };

    return (
      <>
        <form
          className="find-movie"
          onSubmit={(event) => {
            event.preventDefault();

            getFilmsByTitle(query);
          }}
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
                className={Class('input', { 'is-danger': error })}
                value={query}
                onChange={({ target }) => {
                  setQuery(target.value);
                  setError(false);
                  setFilm(null);
                  setIsInList(false);
                }}
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
                type="submit"
                className="button is-light"
                disabled={Boolean(film) || !query}
              >
                Find a movie
              </button>
            </div>

            <div className="control">
              <button
                type="button"
                className="button is-primary"
                disabled={!film}
                onClick={() => {
                  if (film) {
                    if (!addMovie(film)) {
                      setIsInList(true);
                    } else {
                      setQuery('');
                    }
                  }

                  setFilm(null);
                }}
              >
                Add to the list
              </button>
              <br />
              {isInList
                && (<p className="help is-danger">It is alredy in list</p>)}
            </div>
          </div>
        </form>

        <div className="container">
          <h2 className="title">Preview</h2>
          {film && (
            <MovieCard movie={film} />
          )}
        </div>
      </>
    );
  },
);
