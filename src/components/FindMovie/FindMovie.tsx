import React, {
  ChangeEvent,
  FormEvent,
  memo, useCallback, useContext,
} from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { MoviesContext } from '../MoviesContext';
import { findMovie } from '../../API/api';

export const FindMovie: React.FC = memo(() => {
  const {
    query,
    setQuery,
    foundMovie,
    setFoundMovie,
    searchError,
    setSearchError,
    setStoredMovies,
    storedMovies,
    checkIfStored,
  } = useContext(MoviesContext);

  const resetSearchField = useCallback(() => {
    setQuery('');
  }, []);

  const handleChangeQuery = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setQuery(value);
      setSearchError(false);
    }, [],
  );

  const handleSearch = useCallback(async () => {
    if (!query) {
      setSearchError(true);
    } else {
      setSearchError(false);
      setFoundMovie(null);

      try {
        const loadedMovie = await findMovie(query);

        if (loadedMovie?.Response === 'False') {
          setSearchError(true);
        } else {
          setFoundMovie(loadedMovie);
        }
      } catch (error) {
        setSearchError(true);
      }
    }
  }, [query]);

  const addToList = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetSearchField();

    if (foundMovie && !checkIfStored(storedMovies, foundMovie)) {
      setStoredMovies(prevState => ([
        ...prevState,
        foundMovie,
      ]));
      setFoundMovie(null);
    }
  }, [foundMovie, storedMovies]);

  const getStatus = () => (Boolean(!foundMovie
    || checkIfStored(storedMovies, foundMovie)));

  return (
    <>
      <form
        className="find-movie"
        onSubmit={addToList}
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
              className={`input ${searchError && 'is-danger'}`}
              value={query}
              onChange={handleChangeQuery}
            />
          </div>

          {searchError
            && (
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
              onClick={handleSearch}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              disabled={getStatus()}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {!!foundMovie && <MovieCard movie={foundMovie} />}
      </div>
    </>
  );
});
