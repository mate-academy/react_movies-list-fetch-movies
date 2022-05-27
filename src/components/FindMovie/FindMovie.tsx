import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (newMovie: Movie) => void,
  doubleFilm: boolean,
};

export const FindMovie: React.FC<Props> = ({
  onAddMovie,
  doubleFilm,
}) => {
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState<string | null>(null);

  useEffect(() => {
    if (doubleFilm) {
      setIsError('You have already enjoyed this film');
    }
  }, [doubleFilm]);

  const hendlerSearch = useCallback(async () => {
    if (query === '') {
      setIsError('Please choose a film');
    } else {
      const gottenMovie = await getMovie(query);

      if (gottenMovie.Response === 'True') {
        setMovie(gottenMovie);
        setIsError('');
      } else {
        setIsError('Can\'t find a movie with such a title');
      }
    }
  }, [query, movie]);

  const onAdd = useCallback(() => {
    if (movie !== null) {
      onAddMovie(movie);
      setQuery('');
      setMovie(null);
    }
  }, [movie, isError]);

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
              className={classNames(
                'input',
                { 'is-danger': isError },
              )}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <p className="help is-danger">
            {isError}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={hendlerSearch}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={onAdd}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (
          <MovieCard
            movie={movie}
          />
        )}
      </div>
    </>
  );
};
