import cn from 'classnames';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { getMovie, normalizeMovieData } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: Dispatch<SetStateAction<Movie[]>>
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [hasError, setError] = useState(false);
  const [doesMovieExist, setMovieExists] = useState(false);

  const handleQueryChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(false);
    setMovie(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then(result => {
        if ((result as MovieData).imdbID) {
          setMovie(normalizeMovieData(result as MovieData));

          return;
        }

        setError(true);
      }).finally(() => setLoading(false));
  };

  const handleAddMovie = (movieToAdd: Movie) => {
    addMovie(current => {
      if (current.some(
        movieToCheck => movieToCheck.imdbId === movieToAdd.imdbId,
      )) {
        setMovieExists(true);

        return current;
      }

      return [...current, movieToAdd];
    });
    setMovie(null);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              className={cn('input', {
                'is-danger': hasError,
              })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>
          {hasError && (
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
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {doesMovieExist && (
            <p className="help is-danger">
              This movie is already in the list!
            </p>
          )}

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie(movie)}
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
