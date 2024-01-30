import React, { useContext } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import {
  DispatchContext,
  StateContext,
} from '../../management/GlobalContextProvider';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

export const FindMovie: React.FC = () => {
  const {
    query,
    movies,
    movie,
    isMovie,
    showError,
  } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const searchMovie = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: 'clearMovie' });
    dispatch({ type: 'isMovie', payload: true });
    getMovie(query).then(res => {
      if ('Title' in res) {
        dispatch({
          type: 'getMovie',
          payload: {
            title: res.Title,
            description: res.Plot,
            imgUrl: res.Poster,
            imdbId: res.imdbID,
            imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
          },
        });
        dispatch({ type: 'isMovie', payload: false });
      } else {
        dispatch({ type: 'isMovie', payload: false });
        dispatch({ type: 'showError', payload: true });
      }
    });
  };

  const hendleClickAddMovie = () => {
    if (movie) {
      const dobleMovie = movies.some(m => m.imdbId === movie.imdbId);

      if (!dobleMovie) {
        dispatch({ type: 'addMovie', payload: movie });
      } else {
        dispatch({ type: 'clearMovie' });
        dispatch({ type: 'searchText', payload: '' });
      }
    }
  };

  const hendleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'searchText', payload: e.target.value });
    dispatch({ type: 'showError', payload: false });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={searchMovie}
      >
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
              value={query}
              className={cn('input', {
                'is-danger': showError,
              })}
              onChange={hendleSearchChange}
            />
          </div>

          {showError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={query.length === 0}
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', {
                'is-loading': isMovie,
              })}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={hendleClickAddMovie}
              >
                Add to the list
              </button>
            )}
          </div>
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
