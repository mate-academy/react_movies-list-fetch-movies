import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type MovieUpdater = React.Dispatch<React.SetStateAction<Movie[]>>;

export const FindMovie: React.FC<{
  setQuery: (string: string) => void,
  error: string,
  movie: Movie | null
  setMovies: MovieUpdater,
  setMovie: (movie: null | Movie) => void,
  query: string
}> = ({
  setQuery,
  error,
  movie,
  setMovies,
  setMovie,
  query,
}) => {
  const [localQuery, setLocalQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

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
              className={cn('input', {
                'is-danger': error && localQuery && isSearching,
              })}
              value={localQuery}
              onChange={(event) => {
                setLocalQuery(event.target.value);
                setIsSearching(false);
              }}
            />
          </div>

          {(error && localQuery && isSearching) && (
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
              className={cn('button is-light', {
                'is-loading': isSearching && !movie && !error,
              })}
              disabled={!localQuery}
              onClick={(event) => {
                event.preventDefault();
                setQuery(localQuery);
                setIsSearching(true);
              }}
            >
              {!query ? (
                'Find a movie'
              ) : 'Search again'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  if (movie) {
                    setMovies((currentMovies: Movie[]) => {
                      const check = currentMovies.find((value) => {
                        return value.imdbId === movie.imdbId;
                      });

                      if (check) {
                        return currentMovies;
                      }

                      return [...currentMovies, movie];
                    });
                  }

                  setMovie(null);
                  setIsSearching(false);
                  setLocalQuery('');
                  setQuery('');
                }}
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
