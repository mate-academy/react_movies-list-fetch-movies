/* eslint-disable import/no-extraneous-dependencies */
import React, { useCallback, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';

import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

import {
  IsMoviesHaveNewMovie,
  PreperedNewMovie,
  debounce,
} from '../service/movies';

interface Props {
  movies: Movie[];
  OnMovies: (movies: Movie[]) => void;
}

const DELAY = 300;

export const FindMovie: React.FC<Props> = ({ movies, OnMovies }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorMessage, setEerrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, DELAY), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);

    if (errorMessage) {
      setEerrorMessage(false);
    }
  };

  const handleFormClean = () => {
    setAppliedQuery('');
    setQuery('');
    setMovie(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    getMovie(appliedQuery)
      .then(data => {
        const { Response } = data as ResponseError;

        if (Response === 'False') {
          setEerrorMessage(true);

          return;
        }

        setMovie(PreperedNewMovie(data as MovieData));
        setEerrorMessage(false);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log('Catch', error);
      })
      .finally(() => setLoading(false));
  };

  const AddNewMovie = useCallback(() => {
    if (movie && !IsMoviesHaveNewMovie(movies, movie.imdbId)) {
      OnMovies([...movies, movie]);
    }

    handleFormClean();
  }, [OnMovies, movies, movie]);

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': errorMessage })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!query}
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', { 'is-loading': loading })}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => AddNewMovie()}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
