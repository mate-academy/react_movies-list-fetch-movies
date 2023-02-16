import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

type Props = {
  movies: Movie[];
  setMovies: (movie: Movie[]) => void;
  query: string;
  setQuery: (query: string) => void;
};

export const FindMovie: React.FC<Props> = ({
  movies,
  setMovies,
  query,
  setQuery,
}) => {
  const [loadData, setLoadData] = useState(false);
  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [loadedMovie, setLoadedMovie] = useState<Movie | null>();

  const loadMovie = async () => {
    setLoadData(true);

    try {
      const movieFromServer = await getMovie(query);

      setLoadData(false);

      if ('Error' in movieFromServer) {
        throw new Error('Can&apos;t find movie such a title');
      } else {
        const newMovie: Movie = {
          title: movieFromServer.Title,
          description: movieFromServer.Plot,
          imgUrl: movieFromServer.Poster,
          imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
          imdbId: movieFromServer.imdbID,
        };

        setLoadedMovie(newMovie);
      }
    } catch (error) {
      setHasLoadingError(true);
    }
  };

  const addMovie = () => {
    if (loadedMovie
      && movies.every(movie => movie.imdbId !== loadedMovie.imdbId)) {
      setMovies([
        ...movies,
        loadedMovie,
      ]);
    }

    setLoadedMovie(null);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => event.preventDefault()}
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
              className="input is-dander"
              onChange={(event => {
                setQuery(event.target.value);
                setHasLoadingError(false);
              })}
              value={query}
            />
          </div>

          {hasLoadingError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames(
                'button',
                'is-light',
                {
                  'is-loading': loadData,
                },
              )}
              onClick={loadMovie}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {loadedMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {loadedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard
            movie={loadedMovie}
          />
        </div>
      )}
    </>
  );
};
