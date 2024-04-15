import React from 'react';
import cn from 'classnames';
import './FindMovie.scss';

import { useMovieDispatch, useMovieState } from '../MovieProvider';

import { getMovie } from '../../api';

import { MovieCard } from '../MovieCard';

import { Movie } from '../../types/Movie';

export const FindMovie: React.FC = () => {
  const { query, error, movies } = useMovieState();
  const dispatch = useMovieDispatch();

  const [preview, setPreview] = React.useState<Movie | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const handlerQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: '',
      });
    }

    dispatch({
      type: 'SET_QUERY',
      payload: e.target.value,
    });
  };

  const handleFindMovie = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Enter a title to search',
      });

      return;
    }

    setIsLoading(true);

    getMovie(query).then(movie => {
      setIsLoading(false);
      if ('Response' in movie && movie.Response === 'False') {
        dispatch({
          type: 'SET_ERROR',
          payload: "Can't find a movie with such a title",
        });

        return;
      } else {
        setPreview(movie as Movie);

        dispatch({
          type: 'SET_ERROR',
          payload: '',
        });
      }
    });
  };

  const handleAddMovie = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const clone = movies.some(movie => movie.imdbID === preview?.imdbID);

    if (!clone) {
      dispatch({
        type: 'ADD_MOVIE',
        payload: { ...preview },
      });
      setPreview(null);
      dispatch({
        type: 'SET_QUERY',
        payload: '',
      });
    } else {
      dispatch({
        type: 'SET_ERROR',
        payload: 'You already have this movie in your list',
      });

      setPreview(null);
      dispatch({
        type: 'SET_QUERY',
        payload: '',
      });
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': error })}
              value={query}
              onChange={handlerQueryChange}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button', 'is-light', { 'is-loading': isLoading })}
              onClick={handleFindMovie}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {preview && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {preview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={preview} />
        </div>
      )}
    </>
  );
};
